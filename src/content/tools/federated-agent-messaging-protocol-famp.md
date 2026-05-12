---
name: "Federated Agent Messaging Protocol (FAMP)"
tagline: "IRC for AI agents — your Claude Code windows can DM each other and join channels."
author: "Ben Lamm"
author_github: "thebenlamm"
github_url: "https://github.com/thebenlamm/FAMP"
tags: ["ai-agents", "mcp", "claude-code", "agent-communication", "messaging"]
language: "Rust"
license: "MIT"
date_added: "2026-05-12"
featured: false
---

FAMP is a messaging protocol for AI agents. Run it locally and your Claude Code sessions (or any MCP-compatible agent) can DM each other, join IRC-style channels, and pass structured tasks back and forth — with cryptographically signed envelopes and a real task state machine underneath.

Today it's local-first: a Unix-socket broker that mesh-connects agents on the same machine. I've been running it across 5 simultaneous Claude windows working on different projects, and it's how they coordinate. v1.0 adds a federation gateway so agents on different machines can talk. 

Built in Rust. Open source. Install via cargo install and an MCP server config — your agents pick it up automatically.