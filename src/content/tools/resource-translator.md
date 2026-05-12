---
name: "Resource Translator"
tagline: "Machine-translated PRs for your resource files — every commit, every language."
author: "David Pine"
author_github: "IEvangelist"
github_url: "https://github.com/IEvangelist/resource-translator"
website_url: "https://ievangelist.github.io/resource-translator"
tags: ["github-action", "i18n", "localization", "translation", "azure"]
language: "TypeScript"
license: "MIT"
date_added: "2026-05-12"
featured: false
---

Resource Translator is a GitHub Action that opens machine-translated pull requests for your resource files whenever they change. Point it at Azure AI Translator and it handles `.resx`, `.xliff`, `.po`, `.json`, `.ini`, and `.restext` automatically — drop it into any existing workflow, no extra services.

I built it because most i18n tooling is either a hosted product (paying per word forever) or a CLI you have to remember to run. This is just YAML — translation becomes a routine commit on your default branch, with PRs you can review and merge like any other change. Supports per-repo config, glossary terms, and dry-run mode, plus official Azure SDK retries on 408/429/5xx so it stays quiet in CI.

![Resource Translator](https://raw.githubusercontent.com/IEvangelist/resource-translator/3263643/docs/public/og-image.png)