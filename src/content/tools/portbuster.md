---
name: "PortBuster"
tagline: "Global hotkey overlay to find and kill processes by port number (WinUI 3, Windows 11)"
author: "Franz Silva"
author_github: "franzsilva"
github_url: "https://github.com/franzsilva/PortBuster"
thumbnail: "/thumbnails/portbuster.webp"
tags: ["windows", "developer-tools", "winui3", "ports", "tray"]
language: "C#, xaml"
license: "MIT"
date_added: "2026-05-14"
featured: false
---

PortBuster sits in the system tray and does one thing: tells you what's on a port and lets you kill it.
 
 Press Ctrl+Shift+K from anywhere, type a port number, and you'll see the process name, PID, and full command line. Press Enter to kill it, or
 use the Kill button on individual rows. The window closes itself when you're done.
 
 Uses GetExtendedTcpTable (iphlpapi.dll) directly instead of parsing netstat output. Built as a first native WinUI 3 app using the WinUI Agent
 Plugin for GitHub Copilot.