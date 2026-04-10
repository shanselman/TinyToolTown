---
name: "OpenClaw Dashboard"
tagline: "A zero-build FastAPI dashboard starter for OpenClaw agents and self-hosted setups"
author: "CK (Chandima Kulathilake)"
author_github: "cknzraposo"
github_url: "https://github.com/cknzraposo/openclaw-dashboard"
thumbnail: "/thumbnails/openclaw-dashboard.png"
website_url: "https://percy.raposo.ai"
tags: ["dashboard", "home-lab", "ai-agent", "smart-home", "fastapi"]
language: "Python"
license: "MIT"
theme: "terminal"
date_added: "2026-03-10"
featured: false
ai_summary: "A small, readable FastAPI dashboard you can clone and adapt for an OpenClaw agent or any self-hosted setup. It streams live status for things like host health, backups, music, Hue lights, and local AI services without needing a frontend build pipeline."
ai_features: ["🚀 Live updates via Server-Sent Events", "🔧 Zero build step with FastAPI + vanilla JS", "🏠 Tracks host health, backups, music, lights, and local AI services", "🛠️ Designed to be forked and hacked on directly"]
---

A small, self-hosted status dashboard that gives your AI agent - or just you - a live view of the systems it watches: machine health, backups, music playback, Philips Hue lights, local Ollama services, NAS media, cron jobs, and logs.

I built it because my OpenClaw assistant needed a control surface that was easy to understand and easy to modify. So this repo stays deliberately simple: one Python app, static frontend files, Server-Sent Events for live updates, and no npm or frontend build step.

The right way to use it is to clone it, change a few values in `app.py` and `.env`, and shape it around your own stack. It is not trying to be a generic dashboard platform. It is a hackable starter that gets you to a useful dashboard fast.
