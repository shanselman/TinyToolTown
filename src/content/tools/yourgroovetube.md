---
name: "yourgroovetube"
tagline: "A keyboard-driven terminal YouTube viewer powered by Ratatui and mpv."
author: "Christopher Patti"
author_github: "feoh"
github_url: "https://github.com/feoh/yourgroovetube"
release_url: "https://github.com/feoh/yourgroovetube/releases/latest"
thumbnail: "/thumbnails/yourgroovetube.webp"
thumbnail_source: "https://raw.githubusercontent.com/feoh/yourgroovetube/main/yourgroovetube-social-preview.png"
tags: ["youtube", "tui", "terminal", "media-player", "ratatui"]
language: "Rust"
license: "MIT"
theme: "terminal"
date_added: "2026-08-10"
featured: false
---

yourgroovetube brings YouTube discovery and playback into a fast, keyboard-driven terminal interface. Search titles and tags, browse regional popular videos, load public or unlisted playlists, and control persistent mpv playback without reaching for a browser. It renders thumbnails using Kitty, iTerm2, Sixel, or portable Unicode graphics and can switch to audio-only mode while keeping the artwork visible.

I built it for the lean-back music and video sessions where I wanted YouTube's catalog without YouTube's full web interface. Discovery uses the official YouTube Data API, while mpv and a yt-dlp-compatible extractor handle playback. It also tracks playback progress, advances playlist queues automatically, and can explicitly save a video into a configured Plex library.
