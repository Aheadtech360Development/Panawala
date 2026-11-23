---
id: 19
title: Split-screen hero images
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
 - src/assets/css/base.css (split hero rules, .hmedia, .portrait)
 - src/pages/*.html (26 pages: section.dark.split, image wrapper .hmedia, inline wrapper styles moved to CSS)
 - history/prompts/general/19-split-hero-images.general.prompt.md
tests:
 - functional tests 40/40
 - screenshots at 1440, 1920, 1100 and 390 widths
---

## Prompt

baki sab to bilkul theek hai lekin ye jo hero section mai image hai na woh section ka part nhi lag rahi jese kag raha hai alag se lagayi hui hai to isko dekho koi aur acha tareeka jisse ye achi lage

## Response snapshot

Switched every hero with an image (26 pages) to a split-screen layout: on screens 981px and up the image fills the right half of the hero edge to edge (top, bottom and right edges, width min(50vw, 760px)), the section height matches so square images are not cropped, and the text column is limited to the left half. Transparent artwork (Services, Industries) is centred with padding on the hero colour. Below 981px the image runs full width under the text and the section's bottom padding is removed so the image sits flush with the section edge. First attempt failed because inline width:100% on the wrapper overrode the CSS; moved those styles into a .hmedia class.

## Outcome

- ✅ Impact: Hero images read as part of the section instead of a pasted card
- 🧪 Tests: 40/40, visual checks at 4 widths
- 📁 Files: see list
- 🔁 Next prompts: user review; commit and push
- 🧠 Reflection: Inline styles from the wireframe block CSS overrides; move layout styles into classes before restyling

## Evaluation notes (flywheel)

- Failure modes observed: inline style specificity
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
