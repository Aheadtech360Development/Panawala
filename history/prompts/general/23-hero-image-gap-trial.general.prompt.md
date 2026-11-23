---
id: 23
title: Hero image gap trial
stage: general
date: 2026-11-23
surface: agent
model: claude-opus-5-5
feature: none
branch: main
user: umeradnan7106
command: none
labels: ["design","hero","trial"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/assets/css/base.css (--hgap variable)
 - history/prompts/general/23-hero-image-gap-trial.general.prompt.md
tests:
 - screenshots desktop 1440 and mobile 390
---

## Prompt

live site check kerli sahi chal rahi hai lekin mujhe images mai aik cheez try kerni hai dekh raha hoon ke acha lag raha hai ke nhi, abhi jo image lagi hui hai achi lag rahi hain lekin uper neeche se thora sa gap do bilkul chipkao nhi mujhe dekhna hai kesa lag raha hai

## Response snapshot

Added a --hgap variable (48px) to the split hero: on desktop the image panel now starts 48px below the section top and ends 48px above the bottom, and the section min-height grows by the same amount so the image keeps its square shape; on tablets and phones the section gets 48px bottom padding under the image. Local only, not pushed. Reverting is a one-value change (--hgap:0).

## Outcome

- ✅ Impact: Trial version on localhost for the user to compare
- 🧪 Tests: visual checks
- 📁 Files: base.css
- 🔁 Next prompts: keep/adjust/revert the gap; push if kept
- 🧠 Reflection: n/a

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
