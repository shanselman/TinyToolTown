---
name: "cfzt"
tagline: "One command to expose any local service through Cloudflare Zero Trust"
author: "casablanque"
author_github: "casablanque-code"
github_url: "https://github.com/casablanque-code/cfzt"
website_url: ""
tags: ["cli", "tiny", "networking", "devops", "self-hosted", "cloudflare"]
language: "Go"
license: "MIT"
date_added: "2026-06-19"
featured: false
---

`zt up grafana 3000` — that's it. cfzt handles the rest: creates a Cloudflare Tunnel,
configures ingress rules, upserts a CNAME DNS record, sets up a Zero Trust Access
application with an email allowlist, and installs a systemd service that survives reboots.
`zt down grafana` tears everything back down cleanly.

Built out of frustration with manually clicking through the Cloudflare dashboard every
time a new homelab service needed exposing. Now the same setup that used to take 15
minutes of dashboard navigation takes 15 seconds. Works with Docker port auto-detection,
supports QUIC and HTTP/2 protocols, and comes with `zt export` / `zt apply` for
backing up your tunnel config and restoring it on a new machine from a single YAML file.

