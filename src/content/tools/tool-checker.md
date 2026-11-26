---
name: "Tool Checker"
tagline: "Checks dev tools for updates and installs, so you don't have to!"
author: "Simon Kurtz"
author_github: "simonkurtz-msft"
github_url: "https://github.com/simonkurtz-MSFT/tool-checker"
thumbnail: "/thumbnails/tool-checker.webp"
tags: ["cli", "windows", "linux", "updater"]
language: "PowerShell"
license: "MIT"
date_added: "2026-11-26"
featured: false
---

Tool Checker is a PowerShell 7 script that inventories development tools, compares installed versions with upstream releases, and optionally installs missing tools or applies updates. It respects package cooldown periods in registries and allows for individual selection and configuration of tools. Got another one to add? Either submit a PR (please) or add it yourself via the provided configs!

I built it because it saves me a lot of manual checking for dev tool updates. Everything I care about is in one place, eliminating a chore.