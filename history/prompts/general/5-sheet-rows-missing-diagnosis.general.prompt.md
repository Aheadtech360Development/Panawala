---
id: 5
title: Sheet rows missing diagnosis
stage: general
date: 2026-11-17
surface: agent
model: claude-opus-5-5
feature: none
branch: master
user: umeradnan7106
command: none
labels: ["apps-script","google-sheets","debugging"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - apps-script/Code.gs
 - history/prompts/general/5-sheet-rows-missing-diagnosis.general.prompt.md
tests:
 - Apps Script logic in Node with mocked services (21/21 pass after updating stale email expectation)
---

## Prompt

email to arahi hai properly aur sheet mai kuch aya nhi

## Response snapshot

Reasoned that appendRow runs before the notification email and any exception would stop the email and return an error to the site, so rows were written to the script's bound spreadsheet. Likely causes: user is viewing Sheet1 instead of the Contact/Bookings tabs, or the script is bound to a different spreadsheet. Added a whereAmI() helper to Code.gs that logs the bound spreadsheet name, URL, tabs and row counts (editor only, not exposed on the public web app). Gave the user steps to check tabs first, then paste and run whereAmI, and how to fix if the script is bound to the wrong file.

## Outcome

- ✅ Impact: Clear diagnosis path; no deploy needed to run the helper
- 🧪 Tests: 21/21 mock tests pass
- 📁 Files: Code.gs
- 🔁 Next prompts: user reports whereAmI output or confirms rows found in tabs
- 🧠 Reflection: Setup doc should say rows land in the Contact/Bookings tabs, not Sheet1

## Evaluation notes (flywheel)

- Failure modes observed: stale test expectation after config change
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
