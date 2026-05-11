---
name: "WingetDiff"
tagline: "Beautiful ANSI terminal diff for winget export JSON files - see what is different between two machines at a glance."
author: "Amit N"
author_github: "martian-coder"
github_url: "https://github.com/martian-coder/TinyTools/tree/main/WingetDiff"
thumbnail: "/thumbnails/wingetdiff.webp"
tags: ["cli", "windows", "winget", "diff", "terminal"]
language: "C#"
license: "MIT"
theme: "terminal"
date_added: "2026-05-11"
featured: false
---

WingetDiff compares two winget export JSON files and shows you exactly what is different in a gorgeous color-coded terminal table. Version mismatches in orange, missing packages in red, additions in green. Plus it generates ready-to-run winget install/upgrade/uninstall commands so you can sync machines in seconds. Built it because I have a laptop and a desktop and I kept forgetting what I had installed where. Now I just run winget export on both, diff them, and copy-paste the sync commands. The UI has animated spinners, a typewriter effect, and rich ANSI colors because even a CLI tool deserves to look good. Single-file C# program, zero NuGet dependencies, just System.Text.Json from the BCL.