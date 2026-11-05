---
name: "Statusline"
tagline: "A customizable PowerShell prompt and live status line, with a native CLI for bash, zsh, and fish."
author: "Andree Renneus"
author_github: "trackd"
github_url: "https://github.com/trackd/Statusline"
thumbnail: "/thumbnails/statusline.webp"
website_url: "https://github.com/trackd/Statusline"
thumbnail_source: "https://raw.githubusercontent.com/trackd/Statusline/main/docs/images/statuslines.png"
tags: ["terminal", "prompt", "status line", "zsh", "fish"]
language: "C#"
license: "MIT"
theme: "terminal"
date_added: "2026-11-05"
featured: false
---

StatusLine brings your project context, command results, and system activity right to the place you need them: your prompt and terminal status line. Both are built from the same reusable blocks, so you can create a setup that's useful at a glance and make it your own with flexible layouts, colors, gradients, and icons.

![StatusLine prompt examples: plain, Powerline, two-row, and transient layouts](https://raw.githubusercontent.com/trackd/Statusline/main/docs/images/prompts.png)

![StatusLine live status bar examples with session, project, and system information](https://raw.githubusercontent.com/trackd/Statusline/main/docs/images/statuslines.png)

Install the PowerShell module and enable your prompt:

```powershell
Install-Module Statusline
Enable-Prompt
Enable-StatusLine
```

or use the native cli

```bash
# bash
eval "$(statusline init bash)"
# zsh
eval "$(statusline init zsh)"
# fish
statusline init fish | source
```


**Highlights**

- **A prompt that fits your workflow:** one- or two-row layouts, left and right groups, and compact transient prompts.
- **A separate live status line:** keep system activity and other useful blocks visible in terminals that support it, such as Contour (using DECSASD/DECSSDT).
- **Make it yours:** choose gradients, Powerline or rounded segments, and Nerd Font, Unicode, or plain-text icons.
- **Reuse or create blocks:** combine built-in information with your own PowerShell script blocks, including refresh intervals and timeouts.
- **Works across shells:** use the PowerShell module (PowerShell 7.6+) or the native CLI for Bash, Zsh, and Fish—without requiring PowerShell or .NET for the CLI.
- **Stays responsive:** background updates keep the last result for slower blocks and pause after a minute of inactivity.