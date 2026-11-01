---
name: "HeadTrack"
tagline: "Sound that stays put when you turn your head, on any headphones"
author: "Yusuf Kaka"
author_github: "yusufk"
github_url: "https://github.com/yusufk/head-tracked-audio"
thumbnail: "/thumbnails/headtrack.webp"
thumbnail_source: "https://raw.githubusercontent.com/yusufk/head-tracked-audio/main/images/banner.png"
tags: ["macos", "audio", "spatial-audio", "headphones", "webcam"]
language: "Swift"
license: "GPL-3.0"
date_added: "2026-11-01"
featured: false
---

On headphones, sound is glued to your head: turn left and the whole mix turns with you. AirPods fix this with motion sensors in the earbuds, but my ordinary headphones can't. HeadTrack does it with the webcam instead. It follows your head and keeps everything your Mac plays (music, YouTube, films, calls) anchored to the screen, like real speakers.

Under the hood it's a menu-bar app that captures system audio with a Core Audio process tap, renders the left and right channels as two virtual speakers through Apple's HRTF engine, and rotates the listener with your head using Vision face tracking. There are two little radars (top-down and side-on) so you can see what the camera thinks your head is doing, and a hold-to-compare button to hear the difference. Everything runs on-device; camera frames are never stored or sent anywhere.

It started because I had a beach video that sounded flat on headphones and I wanted it to sound like I was there. Building it turned up a few fun surprises: Apple's audio engine turns the listener the opposite way to what you'd expect, Vision's head pitch follows left/right turns on a real face, and swapping one Vision API for another made tracking 3x faster. Universal binary (Apple Silicon + Intel), Homebrew cask (`brew install --cask yusufk/tap/headtrack`), Swift with zero external dependencies.