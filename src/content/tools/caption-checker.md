---
name: "caption-checker"
tagline: "Checks SRT and WebVTT captions against Netflix, BBC and DCMP limits"
author: "Mark Santos"
author_github: "markksantos"
github_url: "https://github.com/markksantos/caption-checker"
thumbnail: "/thumbnails/caption-checker.webp"
website_url: "https://www.markstudios.com/tools/caption-checker"
thumbnail_source: "https://raw.githubusercontent.com/markksantos/caption-checker/main/docs/preview.png"
tags: ["cli", "captions", "subtitles", "srt", "webvtt"]
language: "JavaScript"
license: "MIT"
date_added: "2026-10-25"
featured: false
---

caption-checker reads an SRT or WebVTT file and tells you which captions break a published standard: Netflix English, the BBC subtitle guidelines or the DCMP Captioning Key. It flags captions that read too fast, lines that are too long, too many lines, captions on screen too briefly or too long, gaps under the minimum, overlaps and broken timestamps, with the caption number and timecode for each one.

It has no dependencies (Node 18+) and works as a CLI or a library. It also ships as an MCP server and a Claude Code plugin, so an agent can check a caption file too. Every limit was read from the standard's own page, and the README cites each source. The same checker runs in the browser, with no install and no upload, at the website link below.