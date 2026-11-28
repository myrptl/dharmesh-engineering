import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const scriptSource = readFileSync(
  new URL('../apps-script/Code.gs', import.meta.url),
  'utf8'
);
const scriptConfigSource = readFileSync(
  new URL('../apps-script/Config.gs', import.meta.url),
  'utf8'
);
const contactEmail = JSON.parse(
  readFileSync(new URL('../config/contact.json', import.meta.url), 'utf8')
).email;

function createHarness() {
  const sentEmails = [];
  const cache = new Map();
  const context = {
    CacheService: {
      getScriptCache: () => ({
        get: key => (cache.has(key) ? cache.get(key) : null),
        put: (key, value) => cache.set(key, value),
        remove: key => cache.delete(key),
      }),
    },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: text => ({
        text,
        setMimeType(mimeType) {
          this.mimeType = mimeType;
          return this;
        },
      }),
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => true,
        releaseLock: () => {},
      }),
    },
    MailApp: {
      sendEmail: message => sentEmails.push(message),
      getRemainingDailyQuota: () => 100,
    },
    Utilities: {
      base64Decode: value => Array.from(Buffer.from(value, 'base64')),
      getUuid: () => 'test-uuid',
      newBlob: data => {
        const bytes =
          typeof data === 'string' ?
            Buffer.from(data, 'utf8')
          : Buffer.from(data.map(byte => byte & 255));
        return { getBytes: () => Array.from(bytes) };
      },
    },
  };

  runInNewContext(`${scriptConfigSource}\n${scriptSource}`, context);

  return {
    doPost: context.doPost,
    validateDrawing: context.validateDrawing,
    sentEmails,
  };
}

function makePayload(overrides = {}) {
  return {
    company_name: 'Example Company',
    your_name: 'Example Customer',
    email: 'customer@example.com',
    description: 'Please quote this component.',
    drawing: null,
    ...overrides,
  };
}

function submit(harness, payload) {
  const response = harness.doPost({
    postData: { contents: JSON.stringify(payload) },
  });
  return JSON.parse(response.text);
}

test('valid enquiry sends mail to the fixed recipient with customer reply-to', () => {
  const harness = createHarness();
  const result = submit(
    harness,
    makePayload({
      drawing: {
        fileName: 'drawing.pdf',
        mimeType: 'application/pdf',
        base64: Buffer.from('%PDF-1.7\n').toString('base64'),
      },
    })
  );

  assert.deepEqual(result, {
    success: true,
    message: 'Thank you. We have received your enquiry.',
  });
  assert.equal(harness.sentEmails.length, 1);
  assert.equal(harness.sentEmails[0].to, contactEmail);
  assert.equal(harness.sentEmails[0].replyTo, 'customer@example.com');
  assert.equal(harness.sentEmails[0].attachments.length, 1);
});

test('file MIME, extension, and signature must match', () => {
  const invalidFiles = [
    {
      fileName: 'drawing.jpg',
      mimeType: 'image/jpeg',
      base64: Buffer.from('not a jpeg').toString('base64'),
      message: /contents are invalid/,
    },
    {
      fileName: 'drawing.pdf',
      mimeType: 'image/jpeg',
      base64: Buffer.from([255, 216, 255]).toString('base64'),
      message: /Only PDF and JPEG/,
    },
  ];

  for (const drawing of invalidFiles) {
    const harness = createHarness();
    const result = submit(harness, makePayload({ drawing }));

    assert.equal(result.success, false);
    assert.match(result.message, drawing.message);
    assert.equal(harness.sentEmails.length, 0);
  }
});

test('files larger than 5 MB are rejected without sending mail', () => {
  const harness = createHarness();
  const oversized = Buffer.alloc(5 * 1024 * 1024 + 1, 0x41).toString('base64');
  const drawing = {
    fileName: 'drawing.pdf',
    mimeType: 'application/pdf',
    base64: oversized,
  };
  assert.throws(
    () => harness.validateDrawing(drawing),
    /The drawing must be 5 MB or smaller/
  );
  const result = submit(
    harness,
    makePayload({ drawing: drawing })
  );

  assert.equal(result.success, false);
  assert.match(result.message, /5 MB or smaller/);
  assert.equal(harness.sentEmails.length, 0);
});

test('global rate limit rejects the sixth enquiry in one window', () => {
  const harness = createHarness();
  for (let index = 0; index < 5; index += 1) {
    assert.equal(submit(harness, makePayload()).success, true);
  }

  const limited = submit(harness, makePayload());
  assert.equal(limited.success, false);
  assert.match(limited.message, /Too many enquiries/);
  assert.equal(harness.sentEmails.length, 5);
});
