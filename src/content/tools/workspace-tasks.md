---
name: "Workspace Tasks"
tagline: "A Visual Studio Code extension that automatically discovers, organizes, and allows running of tasks from across a workspace"
author: "Ryan Conrad"
author_github: "camalot"
github_url: "https://github.com/camalot/vscode-workspace-tasks"
thumbnail: "/thumbnails/workspace-tasks.webp"
website_url: "https://marketplace.visualstudio.com/items?itemName=darthminos.workspace-tasks&ssr=false#overview"
thumbnail_source: "https://raw.githubusercontent.com/camalot/vscode-workspace-tasks/refs/heads/develop/res/assets/images/sidebar-collapsed.png"
tags: ["vscode", "extension", "task-runner"]
language: "TypeScript"
license: "Apache-2.0"
date_added: "2026-09-21"
featured: false
---

A powerful [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=darthminos.workspace-tasks&ssr=false#overview) that automatically discovers, organizes, and runs tasks from your workspace. Manage build scripts, run tests, execute workflows, and organize your development tasks with favorites and queues—all from a single, intuitive interface.

I wanted a way to visualize, and organize the large amount of tasks that any given project may have. This could be executing npm install, run GitHub action locally, or perform the docker build. 

I started this project after updates to a very popular VSCode task explorer was updated, changed from free to "trial", no longer open source, and broke because they weren't ready to handle purchases when the trial period for every one ended. It also gave me an opportunity to support other task types, like GitHub actions, that are not supported in that other extension. I also publish on [OpenVSX](https://open-vsx.org/extension/darthminos/workspace-tasks), which allows the extension to be used in forks of VSCode, like Cursor.