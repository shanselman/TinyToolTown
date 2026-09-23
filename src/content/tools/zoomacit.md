---
name: "ZoomacIt"
tagline: "ZoomIt-style screen zoom, draw, and annotation for macOS"
author: "Yusuf Kaka"
author_github: "yusufk"
github_url: "https://github.com/yusufk/ZoomacIt"
thumbnail: "/thumbnails/zoomacit.webp"
website_url: "https://yusuf.kaka.co.za/ZoomacIt/"
thumbnail_source: "https://raw.githubusercontent.com/yusufk/ZoomacIt/main/images/banner.png"
tags: ["macos", "presentation", "screen", "annotation", "tiny"]
language: "Swift"
license: "GPL-3.0"
date_added: "2026-08-31"
featured: false
---

Sysinternals ZoomIt is a presenter's superpower on Windows — freeze the screen, zoom in, draw arrows, type live. macOS never had a proper equivalent. ZoomacIt brings it over: live zoom (magnify a moving screen at 60fps via ScreenCaptureKit), draw/annotate, a region snip to clipboard, a DemoType mode that types your commands for you during a demo, and a break timer. It's a menu-bar app, hotkey-driven, no Dock icon.

It started as a fork after the original community project was archived (Microsoft shipped an official ZoomIt for Mac and "Sherlocked" it), then grew a proper release pipeline: a universal (Apple Silicon + Intel) binary, a Homebrew cask (`brew install --cask zoomacit`), and a docs site. Built in Swift 6 + AppKit with zero external dependencies — most of it vibe-coded over weekends because I just wanted it to exist.