---
name: "Potty Mouth"
tagline: "Drop-in GitHub Action that keeps issue and PR threads profanity-free."
author: "David Pine"
author_github: "IEvangelist"
github_url: "https://github.com/IEvangelist/profanity-filter"
thumbnail: "/thumbnails/potty-mouth.webp"
website_url: "https://ievangelist.github.io/profanity-filter/"
tags: ["github-actions", "moderation", "profanity-filter", "dotnet", "native-aot"]
language: "C#"
license: "MIT"
theme: "terminal"
date_added: "2026-05-12"
featured: false
---

Potty Mouth is a tiny GitHub Action that scans issues, pull requests, and comments for profane content, then rewrites matches using the replacement strategy you choose. It ships 4,900+ curated words across 9 languages, 14 replacement styles, and clean job summaries so maintainers can keep community spaces welcoming without babysitting every thread. It is built with .NET Native AOT, so it starts fast and runs dependency-free on GitHub-hosted runners.

The delightful bit is in the replacement options: classic asterisks, comic-book grawlix, bleep, emoji, redaction blocks, and more. It turns an awkward moderation chore into one small workflow step.