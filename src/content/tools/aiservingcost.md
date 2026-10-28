---
name: "aiservingcost"
tagline: "One-file Python calculator that prices an AI API serving bill: per-request cost, cache discount, and the monthly number."
author: "James Verlander"
author_github: "scrapertweeter3-prog"
github_url: "https://github.com/scrapertweeter3-prog/ai-serving-cost"
website_url: "https://pastagi.com"
tags: ["ai", "llm", "calculator", "cost"]
language: "Python"
license: "MIT"
date_added: "2026-10-28"
featured: false
---

API pricing pages quote dollars per million tokens, but the bill arrives per request, and the cached share of input traffic moves that number around. This file takes input and output token counts, the two per-million rates, a cache share, and a per-request fee, then prints the cost per request, the monthly bill at your volume, and what the cached share is worth in dollars. The --compare flag runs two cache shares side by side (a tie exits 1 so a CI gate can catch it), --json feeds scripts, and negative token counts are refused at the flag. Standard library only, offline, nothing leaves the machine. Defaults run to $0.029 a request, $17,400 a month at 20,000 requests a day, with $5,400 of that absorbed by the cache. I run PastAGI, where the bill teardown behind these numbers is written up.