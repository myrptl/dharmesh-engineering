const MAX_REQUEST_BYTES = 8 * 1024 * 1024;
const MAX_DRAWING_BYTES = 5 * 1024 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_WINDOW_SECONDS = RATE_WINDOW_MS / 1000;
const RATE_LIMIT = 5;

function doPost(e) {
  try {
    const rawBody = e && e.postData && e.postData.contents;
    if (typeof rawBody !== 'string' || !rawBody) {
      return jsonResponse(false, 'Invalid request body.');
    }

    if (
      rawBody.length > MAX_REQUEST_BYTES ||
      Utilities.newBlob(rawBody).getBytes().length > MAX_REQUEST_BYTES
    ) {
      return jsonResponse(false, 'The request is too large.');
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (_error) {
      return jsonResponse(false, 'Invalid request body.');
    }

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return jsonResponse(false, 'Invalid request body.');
    }

    const companyName = requiredText(payload.company_name, 'Company name', 200);
    const yourName = requiredText(payload.your_name, 'Your name', 200);
    const email = requiredText(payload.email, 'Email', 254);
    const description = requiredText(payload.description, 'Description', 10000);

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      throw new RequestValidationError('Please provide a valid email address.');
    }
    if (!Object.prototype.hasOwnProperty.call(payload, 'drawing')) {
      throw new RequestValidationError('Drawing data is invalid.');
    }

    const attachment = validateDrawing(payload.drawing);
    if (!consumeSubmissionRateLimit()) {
      return jsonResponse(false, 'Too many enquiries. Please try again later.');
    }

    const body = [
      'New quotation enquiry from the Dharmesh Engineering website',
      '',
      `Company: ${companyName}`,
      `Name: ${yourName}`,
      `Email: ${email}`,
      '',
      'Requirements:',
      description,
    ].join('\n');

    MailApp.sendEmail({
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: 'New quotation enquiry - Dharmesh Engineering',
      body: body,
      attachments: attachment ? [attachment] : [],
    });

    return jsonResponse(true, 'Thank you. We have received your enquiry.');
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return jsonResponse(false, error.message);
    }
    return jsonResponse(
      false,
      `Unable to send your enquiry. Please email ${CONTACT_EMAIL}.`
    );
  }
}

function requiredText(value, label, maxLength) {
  if (typeof value !== 'string') {
    throw new RequestValidationError(`${label} is required.`);
  }

  const text = value.trim();
  if (!text) {
    throw new RequestValidationError(`${label} is required.`);
  }
  if (text.length > maxLength) {
    throw new RequestValidationError(`${label} is too long.`);
  }
  return text;
}

function validateDrawing(drawing) {
  if (drawing === null) return null;
  if (!drawing || typeof drawing !== 'object' || Array.isArray(drawing)) {
    throw new RequestValidationError('Drawing data is invalid.');
  }

  if (
    typeof drawing.fileName !== 'string' ||
    typeof drawing.mimeType !== 'string' ||
    typeof drawing.base64 !== 'string'
  ) {
    throw new RequestValidationError('Drawing data is invalid.');
  }
  if (
    !drawing.base64 ||
    drawing.base64.length > Math.ceil(MAX_DRAWING_BYTES / 3) * 4 ||
    drawing.base64.length % 4 !== 0
  ) {
    throw new RequestValidationError('Drawing data is invalid.');
  }

  const padding =
    drawing.base64.endsWith('==') ? 2
    : drawing.base64.endsWith('=') ? 1
    : 0;
  const decodedSize = (drawing.base64.length / 4) * 3 - padding;
  if (decodedSize > MAX_DRAWING_BYTES) {
    throw new RequestValidationError('The drawing must be 5 MB or smaller.');
  }
  if (!isValidBase64(drawing.base64, padding)) {
    throw new RequestValidationError('Drawing data is invalid.');
  }

  const fileName = drawing.fileName
    .replace(/\\/g, '/')
    .split('/')
    .pop()
    .replace(/[<>:"|?*\u0000-\u001f]/g, '_')
    .replace(/^\.+/, '')
    .trim();
  if (!fileName || fileName.length > 180) {
    throw new RequestValidationError('The drawing file name is invalid.');
  }

  const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  const isPdf =
    drawing.mimeType === 'application/pdf' && extension === '.pdf';
  const isJpeg =
    drawing.mimeType === 'image/jpeg' &&
    (extension === '.jpg' || extension === '.jpeg');
  if (!isPdf && !isJpeg) {
    throw new RequestValidationError('Only PDF and JPEG drawings are accepted.');
  }

  let bytes;
  try {
    bytes = Utilities.base64Decode(drawing.base64);
  } catch (_error) {
    throw new RequestValidationError('Drawing data is invalid.');
  }
  if (bytes.length > MAX_DRAWING_BYTES) {
    throw new RequestValidationError('The drawing must be 5 MB or smaller.');
  }

  const hasPdfSignature =
    bytes.length >= 5 &&
    bytes[0] === 37 &&
    bytes[1] === 80 &&
    bytes[2] === 68 &&
    bytes[3] === 70 &&
    bytes[4] === 45;
  const hasJpegSignature =
    bytes.length >= 3 &&
    (bytes[0] & 255) === 255 &&
    (bytes[1] & 255) === 216 &&
    (bytes[2] & 255) === 255;
  if ((isPdf && !hasPdfSignature) || (isJpeg && !hasJpegSignature)) {
    throw new RequestValidationError('The drawing file contents are invalid.');
  }

  return Utilities.newBlob(bytes, drawing.mimeType, fileName);
}

function isValidBase64(value, padding) {
  const contentLength = value.length - padding;
  const expectedRemainder = padding === 2 ? 2 : padding === 1 ? 3 : 0;
  if (contentLength % 4 !== expectedRemainder) return false;

  for (let index = 0; index < contentLength; index += 1) {
    const code = value.charCodeAt(index);
    const isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    const isDigit = code >= 48 && code <= 57;
    if (!isLetter && !isDigit && code !== 43 && code !== 47) return false;
  }
  return true;
}

function consumeSubmissionRateLimit() {
  const windowKey = Math.floor(Date.now() / RATE_WINDOW_MS);
  return consumeRateLimit(
    `contact-rate-${windowKey}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS
  );
}

function consumeRateLimit(key, limit, windowSeconds) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return false;

  try {
    const cache = CacheService.getScriptCache();
    const cachedCount = cache.get(key);
    const count = cachedCount === null ? 0 : Number(cachedCount);
    if (!Number.isInteger(count) || count >= limit) return false;

    cache.put(key, String(count + 1), windowSeconds);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(success, message) {
  return ContentService.createTextOutput(
    JSON.stringify({ success: success, message: message })
  ).setMimeType(ContentService.MimeType.JSON);
}

function authorizeScript() {
  MailApp.getRemainingDailyQuota();
}

function testEmail() {
  MailApp.sendEmail({
    to: CONTACT_EMAIL,
    subject: 'Dharmesh Engineering email test',
    body: 'This is a test email from the Apps Script contact form.',
  });
}

function testRateLimit() {
  const key = `contact-rate-test-${Utilities.getUuid()}`;
  try {
    const first = consumeRateLimit(key, 2, 60);
    const second = consumeRateLimit(key, 2, 60);
    const third = consumeRateLimit(key, 2, 60);
    if (first && second && !third) return 'Rate-limit test passed.';
    throw new Error('Rate-limit test failed.');
  } finally {
    CacheService.getScriptCache().remove(key);
  }
}

class RequestValidationError extends Error {}
