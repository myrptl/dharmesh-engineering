import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(root, 'config/contact.json');
const outputPath = resolve(root, 'apps-script/Config.gs');
const { email } = JSON.parse(readFileSync(configPath, 'utf8'));

if (
  typeof email !== 'string' ||
  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
) {
  throw new Error(`Invalid contact email in ${configPath}`);
}

writeFileSync(
  outputPath,
  `// Generated from config/contact.json. Do not edit directly.\nconst CONTACT_EMAIL = '${email}';\n`
);
