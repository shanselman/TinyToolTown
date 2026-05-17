---
name: "Echo"
tagline: "Echo is a blazing-fast, privacy-first, push-to-talk voice typing assistant."
author: "Gennady Romanov"
author_github: "GithubPhobos"
github_url: "https://github.com/GithubPhobos/Echo"
tags: ["windows", "offline", "dotnet", "accessibility", "desktop"]
language: "C#"
license: "MIT"
theme: "newspaper"
date_added: "2026-05-16"
featured: false
ai_summary: "Talk your way to faster typing with a lightning-quick, privacy-first push-to-talk assistant that transcribes and auto-translates your voice right where you need it—perfect for coding, writing, or bilingual brilliance!"
ai_features: ["🔥 Blazing-fast local transcription using OpenAI Whisper", "🎙️ Push-to-talk with zero-latency \"Hot Mic\" recording", "🌍 Instant auto-translation to English from multiple languages", "🛠️ Customizable hotkeys and advanced voice activity detection for flawless input"]
---

**What does it do?** Echo is a lightweight, open-source Windows utility that brings seamless push-to-talk dictation directly to your workflow. By pressing a global hotkey, you can speak and have your words instantly transcribed into any active window using completely local Whisper AI models.

**Why did you build it?** I built it because I wanted to speed up writing complex LLM prompts and code review comments. Most existing solutions were either cloud-based, macOS-exclusive, or heavy Electron/Python apps. I just wanted a fast, native C# tool that sits quietly in the background and does one thing perfectly without eating up RAM.

**Why is it delightful?** It has zero UI bloat! It runs entirely in the console, processes audio 100% offline for maximum privacy, and uses a built-in Voice Activity Detection (VAD) filter so the AI rarely hallucinates from background noise. Just hold the hotkey, speak your thoughts, and watch the text appear.