---
name: "veetee"
tagline: "A DEC VT terminal emulator faithful enough for OpenVMS — VT52 to VT525, with fonts hand-drawn on DEC's own character cells, keyclick, bells and a CRT picture"
author: "Iain Smith"
author_github: "issinoho"
github_url: "https://github.com/issinoho/veetee"
thumbnail: "/thumbnails/veetee.webp"
website_url: "https://veetee.issinoho.com/"
thumbnail_source: "https://veetee.issinoho.com/img/vt525-colour.png"
tags: ["terminal", "dec", "openvms", "vt100", "vt420"]
language: "Rust"
license: "MIT OR Apache-2.0"
theme: "terminal"
date_added: "2026-09-21"
featured: false
---

I wanted a free VT emulator that just worked on the Linux desktop and was loyal to the original DEC ecosystem.

veetee emulates DEC video terminals — the VT52 and VT100 through the VT420 and the colour VT525 — as faithfully as the manuals allow. Every default is what DEC shipped from the factory rather than what xterm does: 7-bit controls, DEC Supplemental in GR, and an LK401 keyboard where the backarrow key sends DEL. The fonts are original pixel designs drawn on DEC's own character cells rather than ROM dumps, and there is a CRT picture behind them with scan lines, dot stretching and smooth scrolling.

It connects over SSH, Telnet, serial lines and local shells, and it speaks LAT, so an OpenVMS node can be reached over DEC's own protocol. There is a visual LK401 keymap editor, VT420 and VT520 Set-Up, session recordings, saved connections, session logs and a searchable history.

It passes vttest across the VT100–VT520 menus headless, and runs esctest2 at VT level 5 with every single difference from xterm written down and explained against a DEC manual reference. Where xterm and DEC disagree, DEC wins.