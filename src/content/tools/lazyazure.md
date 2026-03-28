---
name: "lazyazure"
tagline: "The lazy way of viewing your Azure resources. TUI for drilling down into Azure subscriptions, resource groups and resources."
author: "Mats Estensen"
author_github: "matsest"
github_url: "https://github.com/matsest/lazyazure"
tags: ["cli", "tui", "azure", "terminal", "golang"]
language: "Go"
license: "MIT"
theme: "terminal"
date_added: "2026-03-28"
featured: false
---

Inspired by [lazydocker](https://github.com/jesseduffield/lazydocker), lazyazure is a TUI for quickly browsing through the Azure resource hierarchy from the terminal.

It's quick, simple, re-uses your existing auth (e.g. Azure CLI or Azure PowerShell) and also features a copy portal url to clipboard-feature to go from terminal to portal when it's needed. Written in Go.

It's built as an exercise to learn more about building a TUI and to have something that's useful when working a lot in the terminal (e.g. with a coding agent) instead of constantly navigating through the Azure Portal.
