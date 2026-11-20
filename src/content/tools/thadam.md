---
name: "Thadam"
tagline: "Records what AI coding tools do on your Mac (commands, file changes, network connections and prompts) in a tamper-evident local audit log, with a dashboard to review and export it. Nothing leaves your machine."
author: "Suresh Subramanian"
author_github: "isureshsubramanian"
github_url: "https://github.com/isureshsubramanian/Thadam"
thumbnail: "/thumbnails/thadam.webp"
tags: ["macos", "security", "audit", "ai"]
language: "Rust, C#, TypeScript, Swift"
license: "Apache-2.0"
date_added: "2026-11-20"
featured: false
---

AI coding agents run commands, edit files and reach the network on your behalf, often faster than you can watch. Thadam is a free, open-source audit trail for that work on macOS.

It watches only the AI tools you name (matched by code-signing identity, not file name) and records what they did: commands run, files read and changed, network connections, prompts, and commands you declined. Rows are grouped into sessions and kept in a local, append-only, hash-chained store, so later tampering shows. Secrets and personal data found in commands are redacted before anything is written, and file contents are never stored.

A local dashboard shows sessions, a Flagged queue (secrets, sensitive paths, writes outside the project, unknown hosts, changes to a tool's own configuration), search, export, and a coverage timeline that shows when Thadam wasn't watching.

Everything stays on your Mac. It ships as a signed, notarized installer and is licensed under Apache-2.0. Built in Rust, .NET and React.