# Tiny Tool Town 🏘️

A delightful showcase for **free, fun & open source tiny tools**.

> *"Vibe coding is the GeoCities of the AI era."*

## What is this?

Tiny Tool Town is a community-driven directory of small, delightful, open-source tools. The kind of tools that are stupid and delightful — made for an audience of one, built over a weekend, and probably wouldn't cost more than a buck or two.

**🌐 Visit: [tinytooltown.com](https://tinytooltown.com)**

## Submit Your Tool

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
theme: "neon"  # Optional: Choose a theme for your tool's page
---

A few sentences about your tool. What does it do?
Why did you build it? Why is it delightful?
```

### Available Themes

Each tool can have its own custom theme! Just add the `theme` field to your tool's frontmatter. Choose from:

- `dark` (default) — Modern dark theme
- `light` — Clean light mode
- `geocities` — 90s retro vibes 🌈
- `terminal` — Hacker terminal aesthetic
- `neon` — Cyberpunk neon colors
- `minimal` — Clean and simple
- `pastel` — Soft, dreamy colors
- `matrix` — Green code rain
- `sunset` — Warm sunset tones
- `ocean` — Deep blue waters
- `forest` — Natural greens
- `candy` — Sweet pink theme
- `synthwave` — 80s retrowave
- `newspaper` — Classic print style
- `retro` — Vintage gaming vibes

**Example:**
```markdown
theme: "candy"  # Makes your tool page pink and playful!
```

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

## License

MIT — Made with ✨ vibes ✨ by [Scott Hanselman](https://hanselman.com)
