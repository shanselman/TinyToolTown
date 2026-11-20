---
name: "TRACES.md"
tagline: "A plain-text, append-only format and tiny CLI for recording what an AI agent did"
author: "MaxonT"
author_github: "maxont"
github_url: "https://github.com/MaxonT/TRACES.md"
thumbnail: "/thumbnails/traces-md.webp"
website_url: "https://maxont.github.io/TRACES.md/"
tags: ["ai", "agents", "observability", "markdown", "cli"]
language: "Python"
license: "MIT"
date_added: "2026-11-20"
featured: false
---

TRACES.md is an open format for recording what AI agents did: one append-only file per task, one line per operation with its tool, action and result, failures included. The traces CLI (Python 3.9+, standard library only) can run a command and record its real exit code, append steps, validate a trace and print stats. The validator exits non-zero when a step marked ok carries a non-zero exit code; I ran it and it reported error E040 on such a trace. I maintain it, and this submission was prepared with AI assistance. It is version 0.1, so expect changes.