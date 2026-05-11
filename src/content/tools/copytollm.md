---
name: "CopyToLLM"
tagline: "One hotkey to capture any screen region and auto-paste it into ChatGPT, Claude, or Gemini - image + prompt, zero friction."
author: "Amit N"
author_github: "martian-coder"
github_url: "https://github.com/martian-coder/TinyTools/tree/main/CopyToLLM"
thumbnail: "/thumbnails/copytollm.webp"
tags: ["windows", "screen-capture", "ai", "clipboard", "automation"]
language: "C#"
license: "MIT"
theme: "neon"
date_added: "2026-05-11"
featured: false
---

CopyToLLM is a background Windows utility that captures any screen region and delivers it straight to your favorite AI chat - fully automated.

Press Ctrl+Shift+S anywhere - a snipping overlay appears - drag a region (or click for auto-element detection, Alt+Click for scroll capture, double-click for full screen) - pick ChatGPT, Claude, or Gemini - the tool opens Chrome, pastes the image, and types an analysis prompt. All in one flow.

The scroll capture engine is the crown jewel: it auto-scrolls any UI element, captures each frame, and pixel-stitches them into one seamless full-length screenshot using MAE matching. Works on code editors, web pages, chat logs - anything scrollable.

Built it because I got tired of screenshot, save, open AI, upload, type prompt, wait. Now it is one hotkey. Zero NuGet dependencies, pure .NET 9 + Win32 interop.