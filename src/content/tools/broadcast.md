---
name: "Broadcast"
tagline: "AI-powered per-app noise suppression for PipeWire on Linux — CPU or NVIDIA GPU"
author: "Gareth Hubball"
author_github: "londospark"
github_url: "https://github.com/londospark/broadcast"
release_url: "https://github.com/londospark/broadcast/releases/latest"
thumbnail: "/thumbnails/broadcast.webp"
tags: ["linux", "audio", "noise-suppression", "pipewire", "cli", "gpu", "nvidia", "omarchy"]
language: "Rust"
license: "GPL-3.0-or-later"
theme: "terminal"
date_added: "2026-03-10"
featured: false
ai_summary: "Say goodbye to background noise ruining your calls or streams with this slick AI-powered noise suppressor that lets you pick and choose which apps get the magic treatment—perfect for Linux users who want clean sound without the hassle. It’s like having your own NVIDIA Broadcast but open source and ready to rock on any machine!"
ai_features: ["🤖 AI-driven noise suppression for mic and output audio", "🎛️ Per-app routing control to filter only what you want", "🖥️ Handy CLI and GTK4 GUI for easy toggling and setup", "🔄 Native PipeWire integration with customizable filter chains"]
---

Broadcast routes individual application audio streams through AI noise suppression on Linux. Instead of filtering everything or nothing, you pick which apps get cleaned up — Discord and browser calls get noise-free audio while Spotify and games stay untouched. Per-window routing works too, so two windows of the same app (say, a YouTube Music tab versus a regular browsing tab) can be routed independently.

Built it because every Linux noise suppression tool is all-or-nothing. I wanted typing noise gone from video calls without mangling my music.

Two backends: DeepFilterNet on CPU (~3% of one core, any hardware), or NVIDIA's Maxine SDK on an RTX GPU for noticeably better suppression of sharp transients like keyboard clicks. Every release now bundles the Maxine runtime for desktop RTX cards (Turing through Blackwell), so GPU users don't need their own NVIDIA developer account to turn it on.

Ships as CLI and GTK4+Libadwaita GUI binaries (AUR, `.deb`, `.rpm`, or plain download), plus a native [Omarchy](https://omarchy.org) bar-widget plugin for backend switching, health status, and per-app/per-window routing without leaving the bar.
