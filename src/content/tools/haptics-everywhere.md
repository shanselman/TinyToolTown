---
name: "Haptics Everywhere"
tagline: "Feel buttons, menus and tabs in any Windows app with a haptic mouse or touchpad."
author: "Scott Hanselman"
author_github: "shanselman"
github_url: "https://github.com/shanselman/haptic-outside-labs"
thumbnail: "/thumbnails/haptics-everywhere.webp"
website_url: "https://github.com/shanselman/haptic-outside-labs/releases/latest"
thumbnail_source: "https://raw.githubusercontent.com/shanselman/haptic-outside-labs/main/assets/showcase-window.png"
tags: ["windows", "haptics", "accessibility", "surface", "tray"]
language: "C#"
license: "MIT"
date_added: "2026-11-01"
featured: true
---

Haptics Everywhere is a free, open-source .NET 10 tray app for the Surface Mouse (2nd Edition) and Surface haptic touchpads. Those devices only buzz where an app explicitly asks, so Haptics Everywhere watches your pointer and the UI structure under it through Windows accessibility and adds light, meaningful ticks everywhere else: a land when you reach a button, a detent when you move into a new menu, tab or ribbon group, and an edge when you hit the end of a strip, in any app with no changes to those apps. It's strictly passive: it never moves, clicks or focuses anything, never reads the keyboard, and never reads names or text. Each haptic goes to the mouse or touchpad that caused it, there's an optional tick on window Close buttons, and a "More is better" switch gives denser feedback on fast sweeps. The companion Showcase app lets you feel each sensation and see why each tick happened. It's a proof-of-concept tester build that needs Windows 11 (build 26100+) and a haptic mouse or touchpad. Signed, self-contained x64 and ARM64 releases are available, so no separate .NET installation is required.