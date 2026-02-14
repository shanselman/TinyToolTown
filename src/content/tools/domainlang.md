---
name: "DomainLang"
tagline: "A tiny VS Code tool for writing and validating software architecture models — with autocomplete, hover docs, and go-to-definition."
author: "Lars Baunwall"
author_github: "larsbaunwall"
github_url: "https://github.com/DomainLang/DomainLang"
thumbnail: "/thumbnails/domainlang.png"
website_url: "https://domainlang.net"
tags: ["vscode", "cli", "architecture", "developer-tools", "autocomplete"]
language: "TypeScript"
license: "Apache-2.0"
date_added: "2026-02-14"
featured: false
---

DomainLang is a developer tool for authoring software architecture models right inside VS Code. You write small `.dlang` text files describing your domains, teams, bounded contexts, and integrations — and the extension gives you the full authoring experience: intelligent autocomplete that suggests valid DDD patterns, hover documentation that explains your model elements in context, go-to-definition to jump between related concepts, and real-time validation that catches modeling mistakes as you type.

It feels like writing code, not drawing diagrams. The extension knows your model — so when you reference a bounded context in a context map, it autocompletes the name, warns you if it doesn't exist, and lets you ctrl-click to jump to its definition. A CLI handles validation in CI pipelines, and an agent skill lets AI coding assistants understand your architecture when generating code. It even includes native MCP tools for your Copilot so it intuitively understands your model.

I built it because architecture knowledge shouldn't live in Confluence pages nobody reads. DomainLang puts it in your repo as plain text files — reviewable in PRs, validated on every keystroke, and a joy to write because the tooling actually helps you think about your architecture instead of fighting a drawing tool.