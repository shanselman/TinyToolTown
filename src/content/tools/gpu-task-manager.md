---
name: "GPU Task Manager"
tagline: "See which processes and local AI models are using your GPU memory."
author: "Scott Hanselman"
author_github: "shanselman"
github_url: "https://github.com/shanselman/gputaskman"
thumbnail: "/thumbnails/gpu-task-manager.webp"
tags: ["gpu", "terminal", "monitoring", "llm", "windows"]
language: "Python"
license: "MIT"
date_added: "2026-11-12"
featured: false
---

GPU Task Manager is a cross-platform terminal tool that shows per-process GPU memory and activity instead of just one overall usage number. It can also provide extra context about local AI models and memory use, depending on the device and driver. I built it to answer the practical question “what is using my GPU?” when Task Manager only shows the total. It is an experimental, local tool; its available measurements depend on the platform and hardware.