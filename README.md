# Dharmesh Engineering Website

Company website for Dharmesh Engineering, a family-run manufacturer in Antaliya GIDC, Bilimora, Gujarat. The site introduces the workshop and its CNC turning capabilities and lets prospective customers send quotation enquiries with an optional drawing.

## Website features

- Company history, capabilities, workshop equipment, and quality practices
- Responsive navigation and layouts for desktop and mobile
- CNC and component photography with motion effects
- Enquiry form with company, contact, and requirement fields
- Optional PDF or JPG/JPEG drawing attachment (up to 5 MB)
- Workshop location map and email contact

## Technology

- React 18
- Vite 5
- Framer Motion
- Locally bundled Archivo, Inter, and IBM Plex Mono fonts

## Run locally

Install [Node.js](https://nodejs.org/) and npm, then run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

On Windows PowerShell, if script execution policy blocks `npm`, use the Windows command shim:

```powershell
npm.cmd install
npm.cmd run dev
```

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm run build` | Create the production site in `dist/` |
| `npm test` | Run mocked Apps Script handler tests |
| `npm run preview` | Preview the production build locally |

Build and preview the production site with:

```sh
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static web host.

## Project structure

```text
public/
  images/                 Site photography
  favicon.svg             Browser icon
src/
  components/             Page sections and shared UI
  App.js                  Main page composition
  constants.js            Navigation, company content, and form settings
  main.js                 React entry point and font/style imports
  styles.css              Global styles and responsive layouts
apps-script/
  Code.gs                 Enquiry validation and email handling
tests/
  apps-script.test.js     Mocked tests for the Apps Script handler
index.html                HTML document and page metadata
vite.config.js            Vite and React configuration
```

## Enquiry form

The contact form submits enquiries directly to the Google Apps Script endpoint configured as `SCRIPT_URL` in `src/constants.js`. It accepts an optional PDF or JPEG drawing up to 5 MB. The script validates submissions, applies a global rate limit of five requests per 15-minute window, and sends enquiries to the address in `config/contact.json`; the recipient is never taken from submitted data. The form also includes a honeypot field and a minimum review delay.

Change the contact email only in `config/contact.json`. `npm run build` updates the website and regenerates `apps-script/Config.gs` from that shared setting. Because Google Apps Script is deployed separately, copy both `apps-script/Config.gs` and `apps-script/Code.gs` into the Apps Script project and deploy a new version after changing the contact email.

### Configure Apps Script

1. Open the Apps Script project backing the current `SCRIPT_URL` and add both `apps-script/Code.gs` and the generated `apps-script/Config.gs`.
2. In Apps Script, run `authorizeScript` and approve the Mail permission. `testEmail` sends a real email to the configured contact address, so run it only when you want a test message.
3. Deploy the script as a web app that executes as you and is accessible to anyone. Create a new deployment version. If you deploy the updated code in the existing deployment, its URL should remain the same; if Google gives you a different URL, update `SCRIPT_URL` in `src/constants.js`.
4. Run `npm run build` and upload the **contents of `dist/`** to Hostinger. The Apps Script URL is called directly by the static site.

The Apps Script URL is stored in `src/constants.js` and is called directly by the static site.

### Rate limit and test cases

The script applies a global limit of five submissions per 15-minute window using `CacheService` and `LockService`. It is not per visitor or per IP: busy periods can affect legitimate users, and Apps Script cache entries may be evicted early, so this is a lightweight abuse control rather than a durable security boundary.

Run the local tests with `npm test`. They mock Google services, make no external requests, and send no real email. They cover:

- Valid enquiry: fixed recipient and customer reply-to.
- Invalid file signature and file larger than 5 MB: request rejected with no email.
- Rate limit: first five mock submissions pass; the sixth is rejected.

After deployment, manually submit a real valid enquiry to verify delivery. That sends a real email; it was not run here. `testRateLimit()` in Apps Script also exercises the rate counter without sending mail. Avoid testing the live rate limit with six valid enquiries unless you are ready for up to five notification emails.

## Company details

- **Location:** Antaliya GIDC, Bilimora, Gujarat, India
- **Established:** 2004
- **Products:** Custom brass fittings and turned components made to customer drawings
- **Materials:** Brass, SS304, SS316, mild steel, aluminium, and selected engineering plastics
- **Threads:** BSP, metric, UNF, and NPT
