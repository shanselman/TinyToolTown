---
name: "dotnet-gitmoji"
tagline: "dotnet + git + emoji = dotnet.gitmoji"
author: "Jonathan Búcaro"
author_github: "jebucaro"
github_url: "https://github.com/jebucaro/dotnet-gitmoji"
thumbnail: "/thumbnails/dotnet-gitmoji.webp"
website_url: "https://dotnet-gitmoji.com/"
thumbnail_source: "https://raw.githubusercontent.com/jebucaro/dotnet-gitmoji/main/assets/brand-picker.webp"
tags: ["cli", "gitmoji"]
language: "C#"
license: "MIT"
date_added: "2026-10-28"
featured: false
---

dotnet-gitmoji brings the [gitmoji](https://gitmoji.dev/) commit convention to .NET projects. It installs a prepare-commit-msg hook through [Husky.Net](https://alirezanet.github.io/Husky.Net/) so the hook travels with the repo. When a teammate clones the repo and runs dotnet restore (or opens the project in an IDE), the hook is ready on their first commit.