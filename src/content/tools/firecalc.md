---
name: "firecalc"
tagline: "Tiny FIRE number calculator: one Python file, stdlib only, prints FI number, years to FI, and coast FI."
author: "James Verlander"
author_github: "scrapertweeter3-prog"
github_url: "https://github.com/scrapertweeter3-prog/fire-calc"
thumbnail: "/thumbnails/firecalc.webp"
website_url: "https://firenomics.com/"
tags: ["cli", "finance", "fire"]
language: "Python"
license: "MIT"
theme: "terminal"
date_added: "2026-09-23"
featured: false
---

Give it your annual spending and it prints your FIRE number, how many years away you are given savings and contributions, and what you would need invested today to coast to a target age. The years-to-FI math solves the annuity equation in closed form so there is no simulation, and every rate is real (inflation-adjusted) so results are in today's money. It has --json for scripts, validates inputs (it will refuse a 30% "safe" withdrawal rate), and it exists because I kept rebuilding the same spreadsheet and wanted one command instead. The README links FIREnomics, where I write about withdrawal-rate math, since picking the withdrawal rate is the part that actually risks your retirement.