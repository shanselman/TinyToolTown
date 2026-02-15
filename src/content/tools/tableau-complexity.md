---
name: "Tableau Complexity"
tagline: "A Python utility for parsing Tableau workbooks (.twb / .twbx) to extract per-worksheet metadata (marks, shelves, filters, calcs, parameters, etc.) and compute a configurable complexity score."
author: "John Thompson"
author_github: "JohnMThompson"
github_url: "https://github.com/JohnMThompson/tableau-complexity"
thumbnail: "/thumbnails/tableau-complexity.png"
tags: ["cli", "tableau", "data visualization"]
language: "Python"
license: "MIT"
date_added: "2026-02-14"
featured: false
ai_summary: "Ever wonder which of your Tableau dashboards are secretly spaghetti monsters? This analyzer parses workbooks, scores every worksheet for complexity, and surfaces the calcs, LODs, and shelf density that make some vizzes harder to maintain than others."
ai_features: ["📊 Extracts marks, shelves, filters, calcs, and parameters from every worksheet", "🧮 Configurable complexity scoring with weights for table calcs, LOD expressions, and more", "📁 Batch analyze entire directories of workbooks with recursive mode", "📄 Generates standalone HTML reports for easy sharing with your team"]
---

This tool takes a single Tableau workbook, or a directory of workbooks, and assesses each workbook based on its complexity. Useful for planning a migration away from Tableau, looking for anti-patterns in your workbooks, or just for fun! Outputs include json, csv, or a local html page in a nicely formatted report view.