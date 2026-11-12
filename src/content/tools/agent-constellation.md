---
name: "Agent Constellation"
tagline: "An installable Copilot extension that turns your agent sessions into a live mission-control view."
author: "Scott Hanselman"
author_github: "shanselman"
github_url: "https://github.com/shanselman/agent-constellation"
thumbnail: "/thumbnails/agent-constellation.webp"
tags: ["copilot", "agents", "visualization", "developer-tools", "mission-control"]
language: "TypeScript"
license: "MIT"
date_added: "2026-11-12"
featured: false
---

Agent Constellation is a shareable GitHub Copilot extension that renders a live family tree and mission-control view for Copilot sessions. It helps show which sessions are working, waiting for input, blocked, or finished, and how they relate. Its view is read-only: it does not perform session actions, and it handles local session metadata conservatively. Install it in user scope from the extension folder in this repository; it requires the GitHub Copilot app.