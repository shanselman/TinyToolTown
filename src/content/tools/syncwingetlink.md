---
name: "Syncwingetlink"
tagline: "Syncwingetlink is fix links Winget package source and links folderSyncwingetlink is fix links Winget package source and links folder."
author: "Kazushi Kamegawa"
author_github: "kkamegawa"
github_url: "https://github.com/kkamegawa/syncwingetlink"
thumbnail: "/thumbnails/syncwingetlink.webp"
thumbnail_source: "https://github.com/kkamegawa/syncwingetlink/blob/main/docs/images/synwingetlink_thumbnail.png"
tags: ["cli", "windows", "winget"]
language: "C++"
license: "MIT"
theme: "forest"
date_added: "2026-09-21"
featured: false
---

When you install a portable package with winget, a command-alias symlink is normally created at `%LOCALAPPDATA%\Microsoft\WinGet\Links\.exe`, and because that folder is on your PATH, you can invoke the tool from the CLI.

However, in some environments this symlink is not created or becomes broken. As a result you can only launch the tool by its long real file name, such as `codex_0.x_x86_64-pc-windows-msvc.exe`, and the short alias like codex does not work.

`syncwingetlink` enumerates installed portable packages, compares them against the links that should exist in the `Links` folder, detects the missing/broken ones, and recreates them after user confirmation.