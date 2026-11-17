---
id: 6
title: Local preview server before deploy
stage: general
date: 2026-11-17
surface: agent
model: claude-opus-5-5
feature: none
branch: master
user: umeradnan7106
command: none
labels: ["preview","localhost"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - history/prompts/general/6-local-preview-server.general.prompt.md
tests:
 - curl localhost:4173 /, /book/, /contact/ -> 200
---

## Prompt

sahi hai araha hai mene dekha nhi the tabs ko acha localhost per start karo to mai aik baar dekh ker deploy kerdoonga

## Response snapshot

User confirmed Sheet rows are in the Contact/Bookings tabs. Rebuilt dist/ and started a local static server on http://localhost:4173 in the background (verified 200 on key pages). Listed the pages and what to check, noted that form submits on localhost write real data to the dev Sheet/Calendar, and how to deploy afterwards.

## Outcome

- ✅ Impact: Site previewable locally with live forms
- 🧪 Tests: HTTP 200 checks
- 📁 Files: none changed
- 🔁 Next prompts: user reviews, then deploy to Netlify/Vercel
- 🧠 Reflection: n/a

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
