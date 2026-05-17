---
name: "CISA KEV Deadline Planner"
tagline: "Local CISA KEV deadline planner for pasted CVEs with Markdown, CSV, and ICS export."
author: "Turner Levey"
author_github: "Turner-Levey"
github_url: "https://github.com/Turner-Levey/kev-deadline-planner"
thumbnail: "/thumbnails/cisa-kev-deadline-planner.webp"
website_url: "https://kev-deadline-planner.vercel.app/"
tags: ["cisa", "kev", "cve", "vulnerabilities", "security"]
language: "HTML"
license: "MIT"
theme: "minimal"
date_added: "2026-05-11"
featured: false
ai_summary: "Keep your cybersecurity deadlines in check with a local, no-login planner that matches your CVEs against CISA's Known Exploited Vulnerabilities and helps you prioritize fixes with easy exports and zero tracking fuss!"
ai_features: ["🔥 Extracts and matches CVEs against a bundled CISA KEV catalog", "⚡ Flags ransomware-related vulnerabilities for quick attention", "🎯 Exports your remediation plan as Markdown, CSV, or ICS calendar files", "🚀 Runs fully in-browser with no tracking or signups needed"]
---

CISA KEV Deadline Planner is a tiny local-first web tool for turning pasted CVEs, scanner output, or vulnerability-management notes into a prioritized Known Exploited Vulnerabilities planning queue. It extracts CVE IDs, matches them against a bundled CISA KEV catalog snapshot, sorts overdue and due-soon entries, flags CISA ransomware-campaign-use markers, and exports Markdown, CSV, or ICS planning holds.

I built it for quick vulnerability review workflows where a user needs to answer: which pasted CVEs are in KEV, which due dates are already overdue, and which entries should be reviewed this week. The tool is intentionally static and private: no signup, no cookies, no analytics, no beacons, no uploads, no browser storage, and no external scripts. It is unofficial and tells users to verify current CISA, vendor, applicability, and exposure details before acting.