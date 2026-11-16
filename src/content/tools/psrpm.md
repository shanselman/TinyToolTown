---
name: "PSRPM"
tagline: "Agentless Sysinternals Process Explorer & TCPView GUI over WinRM in pure PowerShell 5.1 (under 0.25% remote CPU)"
author: "exh555"
author_github: "exh555"
github_url: "https://github.com/exh555/PSRPM"
thumbnail: "/thumbnails/psrpm.webp"
thumbnail_source: "https://raw.githubusercontent.com/exh555/PSRPM/main/docs/screenshots/01_process_tree_light.png"
tags: ["windows", "sysadmin", "process-manager", "winrm", "monitoring"]
language: "PowerShell"
license: "MIT"
date_added: "2026-11-16"
featured: true
---

PSRPM (PowerShell Remote Process Manager) brings a Sysinternals Process Explorer-style hierarchical process tree, TCPView-style socket inspection, Windows Services control, and Handle/DLL search to both local machines and remote Windows servers over a single persistent WinRM `PSSession`.

I built it because existing remote Windows diagnostics forced a trade-off between noisy WMI/CIM polling (12-25% CPU spikes and slow `SendMessageTimeout` UI freezes), dropping binaries over SMB shares, or triggering `csc.exe` temp-file churn with inline `Add-Type` scripts. Instead, PSRPM builds all Win32/NTAPI bindings in memory via `.NET Reflection.Emit`, pulls kernel telemetry with `ntdll!NtQuerySystemInformation`, and streams differential GZIP JSON deltas at ~1.1-1.8 KB/s (under 0.25% remote CPU).

It runs out of the box on Windows PowerShell 5.1 (Desktop edition) with zero extra runtime deployment, and includes 6 live-switchable themes (Clean Light, Precision Dark, Tokyo Night, Tokyo Night Light, Classic, High-Contrast), multi-host tabs with zero-bandwidth standby, and opt-in per-process kernel network ETW monitoring.