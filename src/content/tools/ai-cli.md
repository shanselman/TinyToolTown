---
name: "AI CLI"
tagline: "AI CLI translates natural language into shell commands using LLMs (OpenAI, OpenRouter, or a local server)."
author: "https://agingcoder.com/posts/i-built-a-thing/"
author_github: "kriserickson"
github_url: "https://github.com/kriserickson/ai-cli"
tags: ["llm", "cli"]
language: "Go"
license: "MIT"
date_added: "2026-05-06"
featured: false
ai_summary: "Turn your natural language whims into actual shell commands with a clever AI sidekick that keeps safety in check—making terminal magic both effortless and cautious!"
ai_features: ["🤖 Converts plain English into shell commands using powerful LLMs", "🛡️ Applies safety policies to prevent risky command execution", "⚡ Supports multiple AI providers including OpenAI and local servers", "💬 Interactive mode for chatting with your terminal assistant"]
---

I keep using chatbots for the same kind of question, over and over. Not “how do I build a distributed system” questions. The small ones. The ones that should be muscle memory by now, except they aren’t.

Questions like:

- how do I kill the task running on port 5173 
- remove a file from a git commit without deleting it locally
- find all files larger than 10MB
- compress all log files older than 7 days
- show biggest folders in my home directory

AI CLI lets you describe the problem in english and have the LLM you choose (either with an API key or a local model).

When you run:

```bash
ai show what process is using port 8080
```

AI CLI sends a request to your configured provider/model and asks for a command appropriate for your environment (OS, shell, current working directory).