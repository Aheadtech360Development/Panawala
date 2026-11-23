---
id: 21
title: Hero image max-width
stage: general
date: 2026-11-23
surface: agent
model: claude-opus-5-5
feature: none
branch: main
user: umeradnan7106
command: none
labels: ["design","hero","responsive"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/assets/css/base.css (split hero block)
 - history/prompts/general/21-hero-image-max-width.general.prompt.md
tests:
 - functional tests 40/40
 - screenshots at 1440, 1920, 820 and 390 widths
---

## Prompt

images to sahi thi lekin max-width to lagao usme

## Response snapshot

Kept the split hero but bounded the image by the site's 1240px content width: on desktop the image panel now fills the right half of the content area (right edge lined up with the header's Book button), still running the full height of the section; section min-height matches the panel width so square images stay uncropped where text allows. On tablets the image is centred with a 600px max width; phones keep full width. No HTML changes.

## Outcome

- ✅ Impact: Hero image no longer stretches to the viewport edge on wide screens
- 🧪 Tests: 40/40, visual checks at 4 widths
- 📁 Files: base.css
- 🔁 Next prompts: user review; push
- 🧠 Reflection: n/a

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
