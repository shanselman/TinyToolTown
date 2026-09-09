---
name: "xget"
tagline: "Easily install prebuilt binaries from GitHub Releases"
author: "Ryan Conrad"
author_github: "camalot"
github_url: "https://github.com/camalot/xget"
thumbnail: "/thumbnails/xget.gif"
thumbnail_source: "https://github.com/camalot/xget/raw/refs/heads/main/docs/assets/images/xget-demo.gif"
tags: ["cli", "package-installer", "github-release", "cross-platform"]
language: "go"
license: "MIT"
date_added: "2026-09-09"
featured: false
---

xget is the best way to easily get pre-built binaries for your favorite tools. It downloads and extracts pre-built binaries from releases on GitHub. To use it, provide a repository and xget will search through the assets from the latest release in an attempt to find a suitable prebuilt binary for your system. If one is found, the asset will be downloaded and xget will extract the binary to the current directory or path defined as  `--to` argument. 

Install a GitHub package:

``` shell
xget install eza-community/eza --to="~/.local/bin"
```

xget is a fork of the [zyedidia/eget](https://github.com/zyedidia/eget) codebase. It focuses on full backwards compatibility with eget, while also bringing forward new features and fixes.