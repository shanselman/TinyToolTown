---
name: "TinyEdit"
tagline: "A tiny full-screen terminal text editor in plain C, kilo-style, with desktop app vibes"
author: "Roberto Bissanti"
author_github: "robertobissanti"
github_url: "https://github.com/robertobissanti/tinyedit"
thumbnail: "/thumbnails/tinyedit.webp"
thumbnail_source: "https://raw.githubusercontent.com/robertobissanti/tinyedit/refs/heads/master/imgs/python-syntax-highlighting.png"
tags: ["cli", "text editor"]
language: "C"
license: "MIT"
theme: "terminal"
date_added: "2026-10-05"
featured: false
---

TinyEdit is a small full-screen terminal text editor written in plain C (kilo-style, after [kilo](https://github.com/antirez/kilo) by Salvatore Sanfilippo aka antirez), with no dependencies beyond the POSIX standard library.

tinyedit brings the familiar ease of a desktop text editor to the terminal. Traditional terminal editors can require learning modal editing (Vim), memorizing non-standard key sequences (Emacs), or working around limited navigation and selection (Nano). tinyedit reduces that friction with familiar shortcuts such as Ctrl-C, Ctrl-V, Ctrl-Z, and Ctrl-F, Shift+Arrow text selection, and optional mouse support for clicking and scrolling.

I kept building tinyedit because I became convinced that a terminal editor could be simple enough to use every day. While implementing it, I paid close attention to carrying over the mouse gestures and keyboard shortcuts people already know from desktop text editors and word processors. The goal is not to invent another editing language: it is to make opening a terminal file feel immediately familiar.

Recent releases add syntax highlighting for many languages with configurable color themes, Markdown link navigation and live preview, and **Smart Table**: an optional editor for Markdown tables that aligns columns as you type pipes or press Enter, moves between cells with Tab / Shift-Tab and can realign an existing table from the Edit menu, keeping cell text, Unicode widths and undo intact.

Prebuilt binaries for macOS (universal), Linux and WSL (x86_64 and ARM64) are attached to the [latest release](https://github.com/robertobissanti/tinyedit/releases/latest).
