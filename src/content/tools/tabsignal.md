---
name: "Tabsignal"
tagline: "Claude session status tracker (macOS 14+, Swift)"
author: "Kadircan Kara"
author_github: "kadircankara"
github_url: "https://github.com/KadircanKara/tabsignal"
thumbnail: "/thumbnails/tabsignal.gif"
thumbnail_source: "https://github.com/KadircanKara/tabsignal/blob/main/docs/images/rail.gif"
tags: ["cli", "mac", "claude"]
language: "Swift"
license: "MIT"
theme: "terminal"
date_added: "2026-08-21"
featured: false
---

I use this tool daily when I am running multiple claude code sessions. It creates rails when new sessions are started and notifies by changing states and colors when any session:

- Requires input (approval, brainstorming feedback, multiple choice input, etc.)
- When a subagent or the main (orchestrator) agent is done and is now idle
- Rails also include how many subagents are currently running in that session in realtime

The app uses hooks to update rails so if the app is started when a claude code session is running from before, the corresponding rail doesn't appear immediately but claude code hooks fire quite often so the rail appears within seconds.