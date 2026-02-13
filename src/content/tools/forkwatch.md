---
name: "forkwatch"
tagline: "CLI that discovers meaningful patches hiding in GitHub forks"
author: "Ben Curtis"
author_github: "stympy"
github_url: "https://github.com/stympy/forkwatch"
tags: ["cli", "git", "github", "forks", "go"]
language: "Go"
license: "MIT"
date_added: "2026-02-13"
featured: false
---

Forkwatch analyzes GitHub repository forks to find changes that haven't been submitted as pull requests. It filters out noise (bot commits, lock files, CI config), groups changes by file, and highlights convergence... when multiple independent forks touch the same code, that signals that something needs fixing upstream. Built to help maintainers discover valuable work happening in forks without requiring formal PRs.