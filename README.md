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
index.html                HTML document and page metadata
vite.config.js            Vite and React configuration
```

## Enquiry form

The contact form submits enquiries to the Google Apps Script endpoint configured as `SCRIPT_URL` in `src/constants.js`. Deployments that need a different endpoint should update that constant. The form accepts optional PDF and JPEG drawings, checks the file type and 5 MB size limit in the browser, and sends the attachment with the enquiry.

## Company details

- **Location:** Antaliya GIDC, Bilimora, Gujarat, India
- **Established:** 2004
- **Products:** Custom brass fittings and turned components made to customer drawings
- **Materials:** Brass, SS304, SS316, mild steel, aluminium, and selected engineering plastics
- **Threads:** BSP, metric, UNF, and NPT
