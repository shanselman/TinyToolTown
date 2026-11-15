---
name: "Sevi"
tagline: "Live microphone and speaker levels in your zsh prompt on macOS"
author: "Suresh Subramanian"
author_github: "isureshsubramanian"
github_url: "https://github.com/isureshsubramanian/Sevi"
tags: ["terminal", "zsh", "mic", "sound"]
language: "Swift"
license: "Apache-2.0"
theme: "terminal"
date_added: "2026-11-15"
featured: false
---

Sevi adds two live readings to the right edge of your zsh prompt: how loud your surroundings are (microphone) and how loud your Mac is playing (system output). Values are in dBFS with a small bar, for example: mic -41 ▂ · out -14 ▆

It is useful when you wear headphones or hearing devices and want to see at a glance how loud the room is, or how loud you are playing something.

It is small and stays out of the way. It keeps your existing prompt theme and only adds its reading at the end. It listens only while a terminal that uses it is open, and `sevi stop` ends listening at once. Audio is reduced to level numbers in memory and discarded: nothing is recorded, written to disk or sent anywhere, and Sevi makes no network connections.

Optional settings add colour (microphone red, output green), a once-a-second live refresh, and Nerd Font icons in place of the words.

Install: brew install --cask isureshsubramanian/sevi/sevi
Needs macOS 14.2 or later on Apple silicon. Signed and notarised. Apache-2.0.