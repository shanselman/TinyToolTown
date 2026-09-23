---
name: "loadbearer"
tagline: "Benchmark and grade your machine's performance against a reference baseline"
author: "Iain Smith"
author_github: "issinoho"
github_url: "https://github.com/issinoho/loadbearer"
website_url: "https://loadbearer.issinoho.com"
tags: ["benchmark", "system-assessment", "performance", "cli", "testing"]
language: "Rust"
license: "MIT"
date_added: "2026-08-31"
featured: false
---

A command-line system-assessment tool that benchmarks CPU, memory, disk, network, and GPU performance, scoring each component against an embedded reference baseline and grading the machine on an S-to-F scale. Point it at two machines and `loadbearer compare` tells you which is stronger, by how much, and why. It also has a sustained-load test that shows how much performance a machine keeps once it heats up, and can re-grade a saved result against a different baseline without re-running anything. One self-contained binary, no runtime, no network calls. Windows and Linux.