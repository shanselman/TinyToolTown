---
name: "SplitPaneFix"
tagline: "One-click fix for Windows Terminal split panes"
author: "Scott Hanselman"
author_github: "shanselman"
github_url: "https://github.com/shanselman/splitpanefix"
tags: ["cli", "windows", "terminal", "powershell"]
language: "PowerShell"
license: "MIT"
date_added: "2026-02-09"
---

When you split a pane in Windows Terminal, the new pane starts in your home directory instead of where you were. This fixes that. One script, one fix, preserves your current directory using Oh My Posh and OSC 99. The kind of fix that should be built in.
