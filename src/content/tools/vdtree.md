---
name: "vdtree"
tagline: "A standalone CLI that acts like 'ls' for your Windows Virtual Desktops."
author: "Amir Farhadi"
author_github: "amirf147"
github_url: "https://github.com/amirf147/vdtree"
thumbnail: "/thumbnails/vdtree.webp"
tags: ["cli", "windows", "virtual-desktop", "workspace", "window-manager"]
language: "Python"
license: "MIT"
theme: "ocean"
date_added: "2026-05-11"
featured: false
---

`vdtree` is a lightweight command-line utility for Windows 10/11. It translates undocumented internal Windows COM IDs to map out your Virtual Desktops, listing every open window, its exact X/Y coordinates, size, and whether it's pinned across multiple workspaces. You can view the output as a clean table or export it as JSON.

I originally started building this as part of a much larger, overly complex C# window session manager. After hitting a wall with fragile Windows internal APIs that break on every OS update, I decided to embrace the Unix Philosophy: "Do one thing, and do it well." I rewrote the core read-only mapping logic into a single-file Python script and packaged it using PyInstaller.

It is delightful because it requires absolutely zero setup. You just download the standalone `.exe` and run it. It's the perfect little tool for hunting down a window that got lost off-screen after unplugging a monitor, or for scripters who want to map their workspace topology!