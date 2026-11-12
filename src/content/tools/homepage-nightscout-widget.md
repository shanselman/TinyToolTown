---
name: "Homepage Nightscout Widget"
tagline: "A read-only Nightscout glucose widget for the self-hosted Homepage dashboard."
author: "Scott Hanselman"
author_github: "shanselman"
github_url: "https://github.com/shanselman/HomePageNightScoutWidget"
website_url: "https://gethomepage.dev/"
tags: ["nightscout", "dashboard", "self-hosted", "glucose", "widget"]
language: "JavaScript"
license: "MIT"
date_added: "2026-11-12"
featured: false
---

This small Node.js adapter adds recent Nightscout readings to a stock gethomepage.dev dashboard using Homepage's built-in Custom API widget. It displays glucose, trend, and reading freshness, including a stale-data state, while keeping credentials server-side and avoiding stored readings. I built it to make a self-hosted dashboard integration straightforward without a Homepage fork or custom plugin. It is informational only, not a medical device or alerting system.