---
name: "OS-Doctor"
tagline: "A MCP server that lets AI assistants diagnose and monitor Windows system health (hardware sensors), processes, services, event logs, GPU, and DirectX. All without granting write access or command execution."
author: "Breno RdV"
author_github: "brenordv"
github_url: "https://github.com/brenordv/mcp-os-doctor"
tags: ["mcp", "ai", "mcp-server", "windows", "diagnostics"]
language: "C#"
license: "GPL-3.0"
theme: "matrix"
date_added: "2026-05-12"
featured: false
ai_summary: "Peek under the hood of your Windows PC with a read-only AI sidekick that safely monitors hardware, processes, logs, and more—no risky commands, just pure diagnostics magic!"
ai_features: ["🖥️ Read-only system diagnostics without write or command execution", "🔍 Search and analyze Windows event logs and services", "🌡️ Continuous hardware sensor monitoring with detailed stats", "🎮 NVIDIA GPU and DirectX info at your AI assistant's fingertips"]
---

# What is this
A local, read-only Model Context Protocol (MCP) server that exposes Windows system diagnostics to AI assistants. It lets AI clients like Claude Code inspect event logs, services, processes, hardware info, and boot history, all without granting script execution, write access, or network capabilities.

It can monitor your system while you do your thing, and you can recover the info even it your computer crashes!

## Why I built it
Some time ago, the displays of my desktop started to turn black (like if the display was off). This would come and go, until the point where the displays would turn black. I could listen to the computer's audio, but the video never came back. So I knew procrastination was not an option anymore.

I needed to act quickly, but Event Viewer had too much information, so I created this tool to help me diagnose and solve the problem.

It worked perfectly, and helped me a lot, gave me lots of insights about the problem, and now I use it on a daily basis.
If you want the full story, it's [here](https://raccoon.ninja/post/dev/fixing-gpu-display-crashes-on-windows-using-mcp-server-and-ai/).

## Features

| Tool                      | Description                                                                                     |
|---------------------------|-------------------------------------------------------------------------------------------------|
| `get_capabilities`        | Reports available tools, platform, elevation status, and parameter hints                        |
| `query_system_log`        | Search Windows Event Log entries by time, severity, source, and keywords                        |
| `list_log_sources`        | List available event log sources                                                                |
| `get_service_status`      | Query Windows services by name, pattern, or status                                              |
| `list_top_processes`      | List top processes sorted by CPU or memory usage                                                |
| `get_system_info`         | Hardware and OS snapshot (hostname, CPU, memory, disks, uptime)                                 |
| `get_boot_history`        | Boot, shutdown, crash, and sleep/wake events with timestamps                                    |
| `get_gpu_info`            | NVIDIA GPU info: model, driver, VRAM usage, temperature, utilization, power draw via nvidia-smi |
| `get_directx_info`        | DirectX version, display adapters (VRAM, drivers, feature levels), and sound devices via dxdiag |
| `start_sensor_monitoring` | Start background hardware sensor polling (temperature, fan, voltage, clock, load, power)        |
| `stop_sensor_monitoring`  | Stop background sensor monitoring; collected data remains available via `get_sensor_data`       |
| `get_sensor_data`         | Retrieve sensor monitoring results with min/max/average/current statistics per sensor           |

## Security

MCP OS Doctor is **read-only by design**:

- **No write operations**: the server never modifies system state
- **No command execution**: no `Process.Start()`, no PowerShell, no WMI method invocations
- **No network I/O**: stdio transport only, no network listener
- **No credential handling**: never accepts, stores, or transmits credentials
- **Output sanitization**: redacts passwords, tokens, API keys, and connection strings from all output. This is a best-effort attempt, but may not catch all sensitive information due to limitations in parsing and redaction.