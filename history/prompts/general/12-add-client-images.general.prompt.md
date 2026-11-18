---
id: 12
title: Add client images to pages
stage: general
date: 2026-11-18
surface: agent
model: claude-opus-5-5
feature: none
branch: main
user: umeradnan7106
command: none
labels: ["images","performance","content"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/assets/img/pages/*.webp (2)
 - src/assets/img/services/*.webp (6)
 - src/assets/img/industries/*.webp (15)
 - src/pages/contact.html, how-it-works.html, 6 service pages, 15 industry pages, industries.html
 - src/assets/css/industries.css
 - .gitignore (images-original/)
 - history/prompts/general/12-add-client-images.general.prompt.md
tests:
 - screenshots of hero, industries cards, mobile; no broken images
 - functional tests 37/37
---

## Prompt

C:\Users\RT\Downloads\Panawala

is folder mai images hain to is folder ko hamare folder mai karo aur jidher ki jo image hai woh laga do aur local per chala dena mai check kerloonga

## Response snapshot

Copied the folder into the project as images-original/ (gitignored, about 48MB of PNGs). Mapped 23 images by filename to the wireframe's image placeholders: Contact and How it works heroes, 6 service page heroes, 15 industry page heroes, and the same industry images on the 15 Industries listing cards. Converted 1254px PNGs (about 2MB each) to 1000px WebP (51 to 119KB each, about 1.9MB total). Added alt text, lazy loading on cards, and shifted card crop focus up so faces are not cut. Unused: ian-dooley Unsplash portrait (matches no slot). No image supplied for Payroll service page, Services hero and Industries hero; wireframe placeholder kept. Site served at localhost:4173.

## Outcome

- ✅ Impact: Real imagery on 24 placeholders, light page weight
- 🧪 Tests: visual check + 37/37 functional
- 📁 Files: see list
- 🔁 Next prompts: images for Payroll, Services hero, Industries hero; commit and push
- 🧠 Reflection: n/a

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
