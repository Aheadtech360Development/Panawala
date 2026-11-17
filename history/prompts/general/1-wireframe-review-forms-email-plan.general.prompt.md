---
id: 1
title: Wireframe review, forms and email plan
stage: general
date: 2026-11-17
surface: agent
model: claude-opus-5-5
feature: none
branch: master
user: umeradnan7106
command: none
labels: ["wireframe-analysis","forms","google-sheets","email","planning"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - history/prompts/general/1-wireframe-review-forms-email-plan.general.prompt.md
 - src/pages/*.html (33 pages)
 - src/partials/header.html
 - src/partials/footer.html
 - src/assets/css/{base,home,inner,industry,industries}.css
 - src/assets/js/{site,home,book,contact,config}.js
 - src/assets/img/{logo.svg,logo-light.svg,founder.jpg,favicon.svg}
 - build.mjs
 - apps-script/Code.gs
 - apps-script/appsscript.json
 - apps-script/README.md
 - README.md
 - package.json
 - netlify.toml
 - vercel.json
 - .gitignore
tests:
 - pixel diff wireframe vs built site, 15 pages x 1440px/390px (0% diff, Book 5px antialias)
 - puppeteer functional tests with mocked endpoint (37/37 pass)
 - Apps Script logic in Node with mocked Google services (21/21 pass)
---

## Prompt

@"Panawala llc.html"
mujhe poori site banani hai jo ye wireframe ki file di hai same wese hi as it is, isme mobile view bhi hai aur desktop view bhi. Ab isme kuch forms hain woh dekh lena ab usme mujhe ye kerna hai koi bhi form fill kare to hamari google sheet mai data store hojaye aur hamei mail ajaye to ye sab kerna hai.
Pehle properly dekh lo kia kia hai wireframe mai aur email ke lye hum kia use karenge woh bhi batao phir kaam start kerna.

## Response snapshot

Extracted the bundled wireframe (37 page entries + 6 shared components: Header, Footer, CtaBand, Faq, ServicePage, IndustryPage). Inventory: Home, About, Services, 7 service pages (template), Industries, 15 industry pages (template), How it works, Contact, Book, Privacy, Terms, Disclaimer, 404. Responsive via CSS media queries (the mobile/desktop toggle is only a preview frame). Two real forms: Contact (name, email, phone optional, message) and Book (6-step wizard: who, services, industry, situation, contact details, day/time). Recommended Google Apps Script web app as the single backend: appends each submission to a Google Sheet tab and sends a notification email via MailApp (free, no extra service). Flagged that the Book page copy promises Google Calendar availability and a calendar invite, which needs a scope decision. Asked user about booking scope, hosting/stack and notification recipient before building.

User chose: real Google Calendar booking, Netlify/Vercel hosting, testing on umeradnan7106@gmail.com.

Built: wireframe templates rendered to static HTML via a browser-side renderer (original authored styles kept), assembled into src/ with header/footer partials and a zero-dependency build.mjs producing clean URLs in dist/. Vanilla JS for menu, FAQ, home selectors, 6-step booking with live slots, and contact form. Apps Script backend: availability via Calendar Freebusy, event + Meet link + invite, Bookings/Contact tabs, MailApp notifications, lock against double booking, honeypot, formula-injection guard.

## Outcome

- ✅ Impact: Full static site matching the wireframe pixel for pixel, forms wired to Sheet + email + Calendar
- 🧪 Tests: pixel diff 0%, functional 37/37, Apps Script 21/21
- 📁 Files: see files list
- 🔁 Next prompts: deploy Apps Script, paste /exec URL in config.js, deploy to Netlify/Vercel, confirm meeting length
- 🧠 Reflection: Wireframe is a design-canvas bundle; pages must be rebuilt as plain HTML rather than reusing its runtime

## Evaluation notes (flywheel)

- Failure modes observed: regex extraction failed on huge single-line JSON; switched to line-based parse
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
