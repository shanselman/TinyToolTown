---
name: "Pngtools.xyz"
tagline: "Web service for simple PNG image manipulation, all in your browser"
author: "Ville Saalo"
author_github: "zeroone3010"
github_url: "https://github.com/ZeroOne3010/pngtools/"
thumbnail: "/thumbnails/pngtools-xyz.webp"
website_url: "https://pngtools.xyz/"
thumbnail_source: "https://raw.githubusercontent.com/ZeroOne3010/pngtools/refs/heads/main/pngtools.png"
tags: ["web", "png", "image manipulation"]
language: "JavaScript"
license: "MIT"
theme: "minimal"
date_added: "2026-09-09"
featured: false
---

Pngtools.xyz shows PNG image metadata and does some basic image manipulation operations I've found I need from time to time. It can remove a solid color background from your image, replacing it with transparency. The app dynamically discovers the background color by inspecting the edge pixels, so it doesn't matter if your image, like some sprite or emoji, is on a black or pink or purple background. Optionally you can also turn a full color image into a palettized one, or apply a noise-reduction algorithm.

The existing online solutions all seen to upload your image to some backend service, so they're out of the question if you have any privacy concerns. They are often ad-ridden as well, whereas pngtools.xyz is very minimalistic.