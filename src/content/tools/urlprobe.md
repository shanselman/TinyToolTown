---
name: "urlprobe"
tagline: "Tiny zero-dependency URL health checker — one file, Python stdlib only, no install."
author: "James Verlander"
author_github: "scrapertweeter3-prog"
github_url: "https://github.com/scrapertweeter3-prog/urlprobe"
thumbnail: "/thumbnails/urlprobe.webp"
website_url: "https://www.poketdev.com/"
tags: ["cli", "developer-tools", "monitoring"]
language: "Python"
license: "MIT"
theme: "terminal"
date_added: "2026-09-23"
featured: false
---

Point it at a list of URLs (args or stdin) and it prints one line per URL: OK/ERR, status code, latency in ms. I built it because I kept wrapping curl in shell loops to check stacks of endpoints after deploys and wanted one command with a sane exit code instead (0 = all up, 1 = any down, 2 = first failure with --fail-fast). It tries HEAD first and falls back to GET for servers that 405 on HEAD, ignores # comments in stdin lists, and checks in parallel with --workers. Zero dependencies, single Python file — just run it.