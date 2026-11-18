---
id: 14
title: Reorder services, remove contact box
stage: general
date: 2026-11-18
surface: agent
model: claude-opus-5-5
feature: none
branch: main
user: umeradnan7106
command: none
labels: ["content","services","contact"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/index.html
 - src/pages/services.html
 - src/partials/footer.html
 - src/pages/services__tax-planning.html
 - src/pages/services__tax-preparation.html
 - src/pages/services__financial-statements.html
 - src/pages/book.html
 - src/pages/contact.html
 - history/prompts/general/14-reorder-services-contact-box.general.prompt.md
tests:
 - functional tests 37/37
 - screenshots of Home service grid and Contact section
---

## Prompt

Contact page se Serving clients across the United States wala box hata do.

Jahan jahan ye services hain unko is sequence mai kerdo.
1. Tax Projection
2. Tax Planning & Advisory
3. Tax Preparation
4. Accounting
5. Financial Statements
6. Bookkeeping

## Response snapshot

Removed the map-style box on Contact; the same phrase stays as a text line in the Details card and footer. Reordered services to Tax Projection, Tax Planning & Advisory, Tax Preparation, Accounting, Financial Statements, Bookkeeping on Home (slot sizes b4,b2,b3,b3,b3,b3 kept; Tax Preparation keeps its dark card style in slot 3), Services page, footer, Book form options (Not sure yet stays last, renumbered), and Related services pairs on service pages. Prose sentences mentioning services left as is.

## Outcome

- ✅ Impact: Consistent service order site-wide; Contact simplified
- 🧪 Tests: 37/37
- 📁 Files: see list
- 🔁 Next prompts: commit and push
- 🧠 Reflection: n/a

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
