---
name: "URL shortener"
tagline: "A simple HTTP server application for shortening URI addresses."
author: "Vítězslav Šimon"
author_github: "httpsgithubcomVitSimon"
github_url: "https://github.com/VitSimon/urlshort"
tags: ["web", "server", "url", "uri", "shortener", "shortened"]
language: "Go"
license: "MIT"
date_added: "2026-02-13"
featured: false
---

Provides shortened codes for given URI addresses. Each URI address can be defined multiple times and will receive a new code each time. Data is stored in an SQLite database. The server does not record any traffic or code usage. The tool is designed for self-hosting in a local environment.