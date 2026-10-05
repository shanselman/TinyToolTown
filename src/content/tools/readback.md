---
name: "ReadBack"
tagline: "Lightning-fast Windows screen and clipboard narrator with human-grade neural voices, zero cloud API keys, and a floating Fluent glass HUD"
author: "Amir Farhadi"
author_github: "amirf147"
github_url: "https://github.com/amirf147/readback"
thumbnail: "/thumbnails/readback.webp"
website_url: "https://github.com/amirf147/readback#readme"
thumbnail_source: "https://raw.githubusercontent.com/amirf147/readback/master/assets/readback-overview.jpg"
tags: ["windows", "text-to-speech", "accessibility", "productivity", "tts"]
language: "C#"
license: "Apache-2.0"
theme: "synthwave"
date_added: "2026-09-30"
featured: true
---

Reading dense technical documentation, extensive code reviews, and multi-paragraph LLM responses causes persistent eye strain. Most existing desktop text-to-speech tools either rely on robotic legacy synthesizers, demand paid cloud API tokens, or require heavy Python virtual environments with noticeable startup latency.

ReadBack solves this by providing instant, storyteller-grade narration across Windows with zero setup. Built as a self-contained .NET 10 binary, it connects directly to Microsoft Edge natural neural voices (with automatic local SAPI fallback) without requiring API keys, cloud subscriptions, or external runtime installations.

Audio playback starts in under 100 milliseconds through sentence chunking and background synthesis. A floating Windows 11 acrylic glass HUD (Win+H style) anchors to the screen to display live sentence progress, media controls, and speed adjustments up to 3.0x. Text ingestion is decoupled through a pluggable ITextSource pipeline that filters Markdown syntax, automatically summarizes raw code blocks, and enables instant control via global hotkeys, system tray integration, or CLI pipe commands.