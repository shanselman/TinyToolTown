---
name: "Password Maker"
tagline: "Password maker for web and windows"
author: "Thomas Taylor"
author_github: "thomas-taylor"
github_url: "https://github.com/thomas-taylor/password-maker"
thumbnail: "/thumbnails/password-maker.webp"
website_url: "https://thomas-taylor.github.io/passwordmaker/"
tags: ["windows", "web", "password"]
language: "C#"
license: "MIT"
date_added: "2026-05-02"
featured: false
ai_summary: "Whip up strong, random passwords right on your device with zero internet fuss—this nifty tool keeps your secrets local and secure while making password creation a breeze!"
ai_features: ["🔒 Generates cryptographically strong random passwords", "🖥️ Available as both web and Windows desktop apps", "🎯 Fully local operation with no web calls for privacy", "⚙️ Customizable character sets and savable option profiles"]
---

PasswordMaker is a simple tool to create cryptographically strong, pseudorandom strings.  I made this years ago because I could not find an existing one that I liked.  It has lots of options on what characters to include but is mostly just a 'fancy' wrapper on System.Security.Cryptography.RandomNumberGenerator.  There are web (Blazor) and Windows (WPF) versions.  Passwords are made locally (web assembly or window) and never transferred over the internet.