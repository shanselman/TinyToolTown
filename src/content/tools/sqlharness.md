---
name: "SQLHarness"
tagline: "Measure whether your AI agent's SQL rewrite is actually better."
author: "Robert Gonek"
author_github: "rgonek"
github_url: "https://github.com/rgonek/sqlharness"
thumbnail: "/thumbnails/sqlharness.webp"
thumbnail_source: "https://raw.githubusercontent.com/rgonek/sqlharness/v0.4.0/docs/images/comparison.png"
tags: ["sql", "mcp", "cli", "postgresql", "sql-server"]
language: "C#"
license: "MIT"
date_added: "2026-11-15"
featured: false
---

SQLHarness turns “this SQL should be faster” into a repeatable comparison. Measure a baseline and a candidate, check result equivalence for the tested inputs, and inspect elapsed time, CPU, IO and query versions in a local dashboard.

It gives coding agents a measurement loop through MCP, with a CLI for the same workflow. It supports SQL Server, Azure SQL and PostgreSQL. The goal is simple: spend less time guessing whether a rewrite helped, and keep the evidence alongside the SQL.

Free, MIT-licensed and local, with self-contained downloads for Windows x64, Linux x64 and macOS arm64. Latest release: https://github.com/rgonek/sqlharness/releases/tag/v0.4.0

The README includes three real dashboard screenshots populated with explicitly synthetic demo data, plus instructions to reproduce them. The displayed demo numbers are not benchmark claims.