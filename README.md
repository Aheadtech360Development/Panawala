# Panawala, CPA website

Static site built from the `Panawala llc.html` wireframe (desktop and mobile), with the Contact and Book a consultation forms connected to Google Sheets, email notifications and Google Calendar through Google Apps Script.

## Structure

```
src/
  pages/        one file per page (body only). First line holds page meta (title, css, js, output path)
  partials/     header.html, footer.html (inserted by the build)
  assets/
    css/        base.css (all pages) + home, inner, industry, industries
    js/         site.js (menu, FAQ), home.js, book.js, contact.js, config.js (form endpoint)
    img/        logos, founder photo, favicon
apps-script/    Code.gs + appsscript.json for the form backend (setup: apps-script/README.md)
build.mjs       assembles src/ into dist/ (no dependencies)
```

## Commands

```bash
npm run build     # writes dist/
npm run preview   # build + serve dist/ on http://localhost:4173
```

Node 18 or newer. No npm packages are needed for the build.

## Pages and URLs

| URL | Page |
|---|---|
| `/` | Home |
| `/about/`, `/how-it-works/`, `/contact/`, `/book/` | Main pages |
| `/services/` + `/services/{tax-preparation, tax-planning, tax-projection, bookkeeping, accounting, financial-statements, payroll}/` | Services |
| `/industries/` + 15 industry pages under `/industries/.../` | Industries |
| `/privacy/`, `/terms/`, `/disclaimer/` | Legal |
| `/404.html` | Not found |

## Deploy

- **Netlify**: connect the repo. `netlify.toml` already sets build command `node build.mjs` and publish folder `dist`.
- **Vercel**: import the repo. `vercel.json` sets the same.

## Forms

The forms post to the Apps Script web app URL in `src/assets/js/config.js`. Until that URL is filled in, the forms show a friendly "could not send" message. Follow [`apps-script/README.md`](apps-script/README.md) to set it up.
