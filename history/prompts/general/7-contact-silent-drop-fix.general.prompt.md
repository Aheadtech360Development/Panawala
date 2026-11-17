---
id: 7
title: Contact submit silently dropped fix
stage: general
date: 2026-11-17
surface: agent
model: claude-opus-5-5
feature: none
branch: master
user: umeradnan7106
command: none
labels: ["apps-script","forms","honeypot","debugging"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - apps-script/Code.gs
 - src/pages/contact.html
 - src/pages/book.html
 - history/prompts/general/7-contact-silent-drop-fix.general.prompt.md
tests:
 - direct POST to live web app -> {"ok":true}
 - headless browser contact submit from localhost -> ok, thank-you shown
 - Apps Script mock tests 22/22
 - frontend functional tests 37/37
---

## Prompt

Contact us. mai neeche info daal ker send message ker raha hoon to sheet mai bhi kuch add nhi hua aur koi email wagera bhi nhi ayi ye kia baat hai.

## Response snapshot

Backend and localhost browser submissions both returned ok, so the pipeline works. Identified two silent-drop paths that show the thank-you box while saving nothing: honeypot field named "website" (likely filled by browser autofill or a password manager) and a 30 second per-email throttle. Fixes: renamed honeypot to pw_hp_ref with password-manager ignore attributes; honeypot hits now go to a "Spam" tab instead of being discarded; throttle now only skips an identical message within 60 seconds. Disclosed that the old "endpoint missing" functional test sent one real contact submission (A / a@b.co / x) to the live Sheet and email; fixed the test to mock config.js. User must paste updated Code.gs and publish a new version of the existing deployment.

## Outcome

- ✅ Impact: No more silent drops; spam trap safe from autofill
- 🧪 Tests: 22/22 backend, 37/37 frontend
- 📁 Files: Code.gs, contact.html, book.html
- 🔁 Next prompts: user redeploys new version and retests; reports whether they saw thank-you or red error
- 🧠 Reflection: Returning success on dropped submissions hides failures; always log them somewhere

## Evaluation notes (flywheel)

- Failure modes observed: honeypot named like a real field; test assumed empty endpoint after config changed and hit production
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
