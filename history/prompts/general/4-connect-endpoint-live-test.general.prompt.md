---
id: 4
title: Connect endpoint and live test forms
stage: general
date: 2026-11-17
surface: agent
model: claude-opus-5-5
feature: none
branch: master
user: umeradnan7106
command: none
labels: ["apps-script","forms","live-test","google-sheets","calendar"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/assets/js/config.js
 - history/prompts/general/4-connect-endpoint-live-test.general.prompt.md
tests:
 - GET ?action=availability on deployed web app (ok, 5 days x 6 slots)
 - live contact form submit in headless Chrome (sent, ~7.6s)
 - live booking flow in headless Chrome (done, ~5.5s); slot removed from availability afterwards
---

## Prompt

saare steps complete kerdye hain aur neeche ye url bhi dedia hai ab kaam start karo
https://script.google.com/macros/s/AKfycbzlm7K6w4mR3UvMgABFoJcoZRmbeuPpF7wdU7SNUTER3uCGH_TzHf-pjugm4_USrA5X/exec

## Response snapshot

Verified the deployed web app returns live availability. Set the endpoint in src/assets/js/config.js and rebuilt dist/. Ran a live end-to-end test from the built site: one TEST contact message and one TEST booking (Tue Nov 24, 4:30 PM Central, attendee development.aheadtech360@gmail.com). Both succeeded and the booked slot disappeared from availability, confirming the Calendar event. Asked user to verify Sheet rows, notification emails and the calendar invite, then delete the test data.

## Outcome

- ✅ Impact: Forms live end to end on the dev account
- 🧪 Tests: availability GET, live contact, live booking all passed
- 📁 Files: config.js
- 🔁 Next prompts: user confirms Sheet/email/invite; deploy site to Netlify/Vercel; confirm meeting length
- 🧠 Reflection: Headless browser in a non-US time zone shows extra day chips because slots group by local date; correct behaviour for US visitors

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): live tests PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
