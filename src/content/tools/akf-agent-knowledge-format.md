---
name: "AKF (Agent Knowledge Format)"
tagline: "EXIF for AI — stamp any file with a tiny trust receipt"
author: "Arun KT"
author_github: "HMAKT99"
github_url: "https://github.com/HMAKT99/AKF"
thumbnail: "/thumbnails/akf-agent-knowledge-format.gif"
website_url: "https://akf.dev"
tags: ["cli", "ai", "metadata", "provenance", "exif"]
language: "Python   (AKF ships dual SDK Python + TypeScript, but Python is the headline pip install akf story — TS as a single primary language label is fine.)"
license: "MIT"
date_added: "2026-05-12"
featured: false
ai_summary: "Stamp your files with a tiny AI trust receipt that travels with them like a digital passport, making provenance, compliance, and trust as easy as pie—think EXIF but for AI-generated content across docs, images, code, and more!"
ai_features: ["🔥 Embeds AI trust metadata natively in 20+ file formats", "⚡ Generates lightweight ~15 token JSON trust receipts", "🎯 Enables compliance auditing for regulations like the EU AI Act", "🛡️ Tracks source provenance and trust scores without needing a certificate authority"]
---

Every photo has EXIF — camera, lens, when it was taken. AI-generated files have… nothing. So I built AKF: a tiny CLI that stamps any file with a trust receipt — who made it, how confident, what it's based on.                                                                                                                                                                                                           
                                                                                                                                                                                                                
    akf stamp report.md --agent claude-code --evidence "tests pass"
                                                                                                                                                                                                                
That's it. The metadata embeds invisibly in markdown (YAML frontmatter), DOCX, PDF, images, JSON — whatever you've got. `akf read file.md` to inspect, `akf trust file.md` to get a score.
                                                                                                                                                                                                                
 I built it because I kept getting AI-generated docs from agents and had no idea which ones to trust. Now I do. It's the boring infrastructure that photography solved in 1995 — but for the era where half your files are written by a robot.