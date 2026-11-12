---
name: "GitHub Artifacts Analyzer"
tagline: "Find what is filling up GitHub Actions artifact storage across your repos."
author: "Scott Hanselman"
author_github: "shanselman"
github_url: "https://github.com/shanselman/github-artifacts-analyzer"
tags: ["github", "cli", "github-actions", "artifacts", "storage"]
language: "TypeScript"
license: "MIT"
date_added: "2026-11-12"
featured: false
---

GitHub Artifacts Analyzer is a focused CLI that inventories GitHub Actions artifacts and breaks storage usage down by repository and artifact. It highlights expired and removable artifacts and gives practical storage recommendations. It also offers an interactive cleanup mode with safety prompts for people who choose to delete artifacts. I built it to make it easier to find what is consuming the Actions storage quota instead of guessing.