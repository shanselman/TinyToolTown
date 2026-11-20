---
name: "Fast Git Diff Viewer"
tagline: "A very low-memory, fast git diff viewer for Windows, written in plain C against Win32 and GDI. One small exe, no runtime"
author: "Priyan Rajeevan"
author_github: "priyanr"
github_url: "https://github.com/priyanr/diffviewer"
thumbnail: "/thumbnails/fast-git-diff-viewer.webp"
tags: ["git", "windows"]
language: "C"
date_added: "2026-11-20"
featured: false
---

A very low-memory, fast git diff viewer for Windows, written in plain C against Win32 and GDI. One small exe, no runtime, no installer. Leave it open beside your editor or a coding agent and watch changes arrive.

Point it at a repo: lists added / modified / deleted / untracked / renamed files.
Working tree vs HEAD, staged vs unstaged, and commit/branch vs commit/branch.
Side-by-side diff with a toggle to unified, Prev/Next change across files.
Changed words inside a changed line are highlighted, not only the whole line.
Syntax highlighting, picked by file extension or from the status bar: C/C++, C#, CSS, Go, HTML, Java, JavaScript, JSON, Kotlin, PowerShell, Python, Rust, Shell, SQL, TypeScript, XML, YAML, Zig.
"Ignore line endings" (on by default), so a file re-saved with CRLF shows only its real edits.
Auto-refresh when files in the repo change, keeping the selection and scroll position.
Read-only: it never runs a git command that changes the repo, index or working tree.
Dark/light theme follows Windows; per-monitor DPI aware.