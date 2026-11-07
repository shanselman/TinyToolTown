---
name: "vhr-bench"
tagline: "Benchmark a Linux server's CPU, memory and disk IOPS in about a minute"
author: "VPS Host Review"
author_github: "vpshostreview"
github_url: "https://github.com/vpshostreview/vhr-vps-benchmark"
thumbnail: "/thumbnails/vhr-bench.webp"
website_url: "https://vpshostreview.com/vps-benchmark-tool"
tags: ["benchmark", "linux", "server", "cli"]
language: "Shell"
license: "MIT"
theme: "terminal"
date_added: "2026-11-07"
featured: false
---

vhr-bench is a single MIT-licensed Bash script that benchmarks a Linux server in about a minute: sysbench CPU and memory, plus fio 4k random read and write IOPS. It asks before installing sysbench or fio, sends nothing anywhere unless you pass an upload token, and `--cleanup` removes the packages it installed. I use it to check a new VPS before deploying to it, and to compare hosts and plans on equal terms.

Run it once:

```bash
curl -fsSL https://github.com/vpshostreview/vhr-vps-benchmark/releases/latest/download/vhr-bench | bash -s -- --cleanup
```