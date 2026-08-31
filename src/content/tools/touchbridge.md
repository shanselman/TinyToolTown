---
name: "TouchBridge"
tagline: "Turn your iPhone into a Touch ID bar — Face ID unlocks sudo on any Mac"
author: "Arun KT"
author_github: "HMAKT99"
github_url: "https://github.com/HMAKT99/UnTouchID"
thumbnail: "/thumbnails/touchbridge.webp"
website_url: "https://github.com/HMAKT99/UnTouchID"
tags: ["macos", "ios", "sudo", "touch-id", "face-id"]
language: "Swift"
license: "MIT"
date_added: "2026-05-12"
featured: true
ai_summary: "Wave goodbye to typing passwords on your Mac and unlock sudo with a tap or a face scan on your phone or watch—no pricey Magic Keyboard needed! It's like having Touch ID magic in your pocket, making Mac security way cooler and way easier."
ai_features: ["🔓 Use iPhone, Android, Apple Watch, Wear OS, or any browser to authenticate", "⚡ Instant sudo unlock with Face ID or fingerprint", "💸 No extra hardware or subscription fees", "🛡️ Secure local authentication using device secure enclaves"]
---

Touch ID is great — until you don't have it. Mac mini, Mac Studio, and the new MacBook Neo (base variant) all ship without a built-in fingerprint sensor, so every `sudo` is a password prompt. Apple's official fix is a  $199 Magic Keyboard with Touch ID or up-selling to higher variant.                                                                                                                                                                           
                                                                                                                                                                                                                
TouchBridge does it for free. Type `sudo`, your iPhone buzzes, tap Face ID, done. Works on any Mac (Intel or Apple Silicon), with any keyboard.                                                               
                                                                                                                                                                                                                
The private key lives in your iPhone's Secure Enclave and never leaves. Pairing is local, transport is BLE — no cloud, no account, no telemetry. Falls back to your password cleanly if the phone isn't around.                                                                                                                                                                                                       
                           
I built it because I refused to buy a $199 keyboard just to skip typing my password. Turns out a lot of other people felt the same way — 200+★ and counting, listed in awesome-mac and GitHub's  productivity-tools collection.