---
name: "zoxide-doctor"
tagline: "A zero-dependency checkup for zoxide, PATH, and shell initialization."
author: "LTD Atlas"
author_github: "jiankn"
github_url: "https://github.com/jiankn/zoxide-doctor"
website_url: "https://zoxide.org/tools/zoxide-doctor/"
tags: ["cli", "shell", "linux", "developer-tools", "diagnostics", "zoxide"]
language: "JavaScript"
license: "MIT"
date_added: "2026-08-06"
featured: false
theme: "terminal"
---

zoxide-doctor explains why an installed zoxide setup is not working. It checks whether the binary is on PATH, verifies `zoxide init` for the selected shell, looks for active initialization in common profile files, reports optional fzf availability, and can emit machine-readable JSON. The tool is read-only, has no runtime dependencies, and runs on Linux, macOS, and Windows.

This is an independent community tool, not an official zoxide project.
