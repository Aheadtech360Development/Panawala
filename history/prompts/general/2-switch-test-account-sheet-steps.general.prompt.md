---
id: 2
title: Switch test account, Sheet setup steps
stage: general
date: 2026-11-17
surface: agent
model: claude-opus-5-5
feature: none
branch: master
user: umeradnan7106
command: none
labels: ["apps-script","google-sheets","setup","config"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - apps-script/Code.gs
 - apps-script/README.md
 - history/prompts/general/2-switch-test-account-sheet-steps.general.prompt.md
tests:
 - none
---

## Prompt

hum umeradnan7106@gmail.com se nhi karenge development.aheadtech360@gmail.com se karenge saare test wagera. Google sheet ka kaam pehle kerke dedoon kia ager haan to mujhe proper steps batao mene Panawala ke naam se sheet bana li hai development.aheadtech360@gmail.com wali email mai aur apps-script/README.md is file mai jo steps the usme  1. Create the Sheet and script wale saare kerlye, doosra samajh nhi araha tha properly

## Response snapshot

Changed NOTIFY_EMAILS in Code.gs and the README to development.aheadtech360@gmail.com. Confirmed the Sheet/Apps Script work should be done first. Explained step 2 (it is only checking the settings block at the top of Code.gs, and changing the email line because the pasted code still had the old address) and walked through steps 3 and 4 (run setup, authorize, deploy web app, copy /exec URL, test the availability URL) in plain Roman Urdu.

## Outcome

- ✅ Impact: Testing account switched; user has clear steps to finish backend setup
- 🧪 Tests: none
- 📁 Files: Code.gs, apps-script/README.md
- 🔁 Next prompts: User shares /exec URL, then paste into config.js and test end to end
- 🧠 Reflection: README step 2 was a reference table, not an action; needed plainer wording

## Evaluation notes (flywheel)

- Failure modes observed: setup doc step 2 was unclear to a non-developer
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
