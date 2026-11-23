---
id: 17
title: Replace six hero images
stage: general
date: 2026-11-23
surface: agent
model: claude-opus-5-5
feature: none
branch: main
user: umeradnan7106
command: none
labels: ["images","content"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/assets/img/services/tax-planning-2.webp, tax-projection-2.webp, financial-statements-2.webp (old versions removed)
 - src/assets/img/pages/how-it-works-2.webp, industries-2.webp, services-2.webp (old versions removed)
 - src/pages/services__tax-planning.html, services__tax-projection.html, services__financial-statements.html, how-it-works.html, industries.html, services.html
 - images-original/2026-11-23/ (originals, gitignored)
 - history/prompts/general/17-replace-six-hero-images.general.prompt.md
tests:
 - hero screenshots of the 6 pages, all images loaded
 - functional tests 37/37; every img src in dist resolves
---

## Prompt

[6 images attached: Tax Planning & Advisory, Tax Projection, Financial Statements, How it works steps, Industries icon circle, Services icon circle]
isko local per start karo aur downloads mai 6 images hain woh dalni hain aur kuch images jo lagi hui hain unko hata ker inme se lagani hain

## Response snapshot

Found the 6 PNGs (1254px square) in Downloads; Industry Page and Services Page have transparent backgrounds. Compared plain 4:3 crop vs full image on blurred sides: crop cut icons, titles and steps, so used blurred sides for Tax Planning, Tax Projection and Financial Statements, flat matching-colour padding for How it works, and transparent padding for Industries and Services so the maroon hero shows through. Exported 1200x900 WebP (37 to 120KB) under new file names to avoid stale caches, replaced the old images on the 6 pages with updated alt text, deleted the old files, kept originals in images-original/2026-11-23/. Local server already running at localhost:4173. Flagged that the Industries artwork's labels differ from the site's industry list and "Restaurants" has a stray mark.

## Outcome

- ✅ Impact: New artwork on 6 heroes without cropping
- 🧪 Tests: 37/37, screenshots
- 📁 Files: see list
- 🔁 Next prompts: user review; possibly regenerate Industries artwork; commit and push
- 🧠 Reflection: Square artwork in 4:3 frames needs fit-not-crop handling per image type

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
