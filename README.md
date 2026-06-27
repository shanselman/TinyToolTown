# Tiny Tool Town 🏘️

A delightful showcase for **free, fun & open source tiny tools**.

> *"Vibe coding is the GeoCities of the AI era."*

## What is this?

Tiny Tool Town is a community-driven directory of small, delightful, open-source tools. The kind of tools that are stupid and delightful — made for an audience of one, built over a weekend, and probably wouldn't cost more than a buck or two.

**🌐 Visit: [tinytooltown.com](https://tinytooltown.com)**

## Submit Your Tool

Every accepted tool also creates an **author page** automatically. If your GitHub username is `your-username`, your page will be:

```text
https://www.tinytooltown.com/authors/your-username/
```

That page collects all of your Tiny Tool Town tools, your GitHub avatar, tags, languages, latest additions, and a personal RSS feed.

### Option 1: GitHub Issue (Easy)
1. [Open a new issue](https://github.com/shanselman/TinyToolTown/issues/new?template=submit-tool.yml)
2. Fill out the form
3. A maintainer will label it `approved`
4. A PR is auto-created and merged — your tool appears on the site! ✨

### Option 2: Pull Request
1. Fork this repo
2. Create `src/content/tools/your-tool-name.md`
3. Use the template below
4. Submit a PR

### Tool Template

```markdown
---
name: "Your Tool Name"
tagline: "A one-line description"
author: "Your Name"
author_github: "your-username"
github_url: "https://github.com/you/your-tool"
website_url: "https://optional-demo.com"
tags: ["cli", "fun", "tiny"]
language: "Python"
license: "MIT"
date_added: "2026-02-09"
featured: false
---

A few sentences about your tool. What does it do?
Why did you build it? Why is it delightful?
```

## Author Pages

Author pages are generated from the `author_github` value on each tool. You do **not** need to create a separate author file to get a page — submit one accepted tool and your author page exists automatically.

Want to customize it? You have two options:

### Option 1: Author Page Issue

Open a [Customize an Author Page issue](https://github.com/shanselman/TinyToolTown/issues/new?template=customize-author.yml) and tell us what bio, headline, links, notes, or featured tool groups you want.

For safety, the request should come from the same GitHub account as the author page being claimed.

### Option 2: Pull Request

Add `src/content/authors/your-username.md`:

```markdown
---
github: "your-username"
name: "Your Name"
headline: "Tiny CLI tools, weird browser experiments, and delightful automation."
website_url: "https://example.com"
links:
  - label: "Blog"
    url: "https://example.com/blog"
notes:
  - "I like tiny tools that do one thing well."
sections:
  - title: "Terminal helpers"
    description: "Small command-line tools for daily development papercuts."
    toolSlugs:
      - "your-tool-slug"
---
I make small tools that scratch very specific itches.
```

The generated page will still list all tools submitted under your GitHub username. Your author file only customizes the intro, links, notes, and optional featured groups.

## What makes a good Tiny Tool?

- ✅ **Free & open source** — Source code on GitHub
- ✅ **Tiny & focused** — Does one thing well
- ✅ **Delightful** — Makes you smile
- ✅ **Made with love** — Built because you wanted it to exist
- ❌ Not enterprise SaaS or paid software
- ❌ Not abandoned or broken

## Tech Stack

- [Astro](https://astro.build) — Static site generator
- [GitHub Pages](https://pages.github.com) — Hosting
- [GitHub Actions](https://github.com/features/actions) — CI/CD + auto tool submission
- Zero backend. Zero database. Zero cost.

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## AI Summary Generator

A .NET 10 CLI tool in `tools/TinyToolSummarizer/` that uses the [GitHub Copilot SDK](https://github.com/jamesmontemagno/hello-copilot-sdk-dotnet) to auto-generate fun AI summaries and key features for every tool in the directory.

### Prerequisites

- .NET SDK supporting `net10.0`
- [Copilot CLI](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-the-command-line) installed and authenticated (or `GH_TOKEN` env var with Copilot Requests permission)
- `GH_TOKEN` is also recommended for higher GitHub API rate limits when fetching READMEs

### Usage

```bash
cd tools/TinyToolSummarizer
dotnet run
```

**Interactive mode** gives you three options:
1. Only process tools without AI summaries (default)
2. Re-run on ALL tools (overwrite existing)
3. Pick a specific tool

**Headless mode** for CI/automation:

```bash
dotnet run -- --headless              # New tools only
dotnet run -- --headless --all        # Re-generate all
dotnet run -- --headless --tool name  # Specific tool (without .md)
```

The tool fetches each tool's GitHub README, sends it to Copilot, and writes `ai_summary` and `ai_features` into the markdown frontmatter. The website renders these automatically on each tool's detail page.

## License

MIT — Made with ✨ vibes ✨ by [Scott Hanselman](https://hanselman.com)
