---
id: 27
title: Mobile spacing and type
stage: general
date: 2026-11-23
surface: agent
model: claude-opus-5-5
feature: none
branch: main
user: umeradnan7106
command: none
labels: ["responsive","mobile","design"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/*.html, src/partials/*.html (404 inline padding/gap declarations made fluid with clamp)
 - src/pages/index.html (trust strip class)
 - src/assets/css/base.css (mobile type and spacing block, FAQ and CTA band rules, removed forced .sec 64px)
 - history/prompts/general/27-mobile-spacing-and-type.general.prompt.md
tests:
 - functional tests 40/40
 - desktop 1440 pixel comparison vs previous build: 13/14 pages 0.000%, Industries differs only by lazy image load timing (same height)
 - mobile page heights before/after at 390px
---

## Prompt

mobile view mai her jagah padding bohot zyada hai jiski wajah se page bhi acha khasa lamba horaha hai aur text bhi multiple lines mai jaraha hai to her jagah padding sahi karo aur khaas tor per "Ready to know where you stand?" wale section ko ye her page per hai

## Response snapshot

Converted every inline padding and gap of 32px or more into clamp(max(20, v/2)px, v/12 vw, v px): unchanged at 1200px and wider, roughly half on phones. Added a mobile block (max-width 720px): smaller h1/h2/lead/body and large inline headings, smaller bento/rule card padding, smaller hero image gap, trust strip as a clean list, tighter FAQ items, CTA band with arrows hidden and full-width buttons; removed the forced 64px .sec padding. Mobile page heights dropped about 10 to 18 percent (Home 13266 to 11223px, Contact 4478 to 3684px). Desktop verified unchanged against the previous build. Local only.

## Outcome

- ✅ Impact: Shorter, less cramped mobile pages; CTA band text uses the full width
- 🧪 Tests: 40/40; desktop parity; mobile heights
- 📁 Files: see list
- 🔁 Next prompts: user review on phone; push
- 🧠 Reflection: Fluid clamp keeps desktop identical while fixing every breakpoint at once

## Evaluation notes (flywheel)

- Failure modes observed: lazy-loaded images make full-page pixel diffs flaky
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
