---
name: "Digital Clock"
tagline: "A small customizable digital clock for windows"
author: "Bimal"
author_github: "only-bimal"
github_url: "https://github.com/Only-Bimal/DigitalClock"
tags: ["windows", "clock", "desktop"]
language: "C#"
license: "MIT"
theme: "minimal"
date_added: "2026-11-03"
featured: false
---

A customizable desktop clock application built with **.NET 10** and **WPF**.
## ✨ Features

* **Windows Aero(??) Glass & Backplates**: Native DWM desktop blur-behind with specular borders, Dark/Light frosted rounded pills, and 100% transparent floating text.
* **Curated & System Typography**: Embedded **Digital 7-Segment (DSEG7)** LCD clock font + dynamic loading of every installed Windows font (Segoe UI, Bahnschrift, Consolas, Cascadia Code, etc.).
* **Dynamic Colors & Themes**: Automatic synchronization with your **Windows Accent Color**, vibrant quick-preset palette, and full Hex/RGB custom color picker.
* **Smart Screen Fit & Position Persistence**: Automatically sizes from border-to-border on first run, saves exact coordinates and dimensions across restarts, and supports one-click size reset.
* **Click-Through (Ghost) Mode**: Allows mouse clicks to pass completely through to underlying desktop icons and applications.
* **Rich System Tray (Notification Area) Menu**: Fast access to clock visibility, Always on Top, Ghost mode, formatting, multi-monitor alignment, and settings.
* **Smart Portable & AppData Storage**: Self-contained `settings.json` alongside the executable in portable setups, with automatic `%AppData%` fallback when placed in write-protected paths (e.g. `Program Files`).
* **PerMonitorV2 DPI Aware**: Crystal-sharp vector graphics on multi-monitor setups with mixed DPI scaling (1080p, 1440p, 4K).