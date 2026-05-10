---
name: "Pexel Wallpaper"
tagline: "Set your desktop to a dynamic slideshow of beautiful images from your favorite Pexels collections using the Plash app (Mac OS) or Lively App (Windows)"
author: "Geert"
author_github: "geert"
github_url: "https://github.com/Geert/pexel-wallpaper"
website_url: "https://geert.github.io/pexel-wallpaper/"
tags: ["windows", "macos", "wallpaper", "pexel"]
language: "Javascript"
license: "MIT"
date_added: "2026-05-05"
featured: false
ai_summary: "Turn your desktop into a stunning rotating gallery by streaming gorgeous shots from your favorite Pexels collections—effortlessly syncing with Mac or Windows apps to keep your background fresh and fabulous all day long!"
ai_features: ["🎨 Seamless integration with Pexels API for endless beautiful wallpapers", "🖥️ Supports both Mac (Plash) and Windows (Lively) dynamic backgrounds", "🔄 Interactive on-desktop settings for easy slideshow setup", "🌍 Multi-language support and offline fallback for smooth vibes anywhere"]
---

This web application provides the Pexels integration for Plash or Lively, allowing you to easily configure and display high-quality wallpapers.

[Live Demo](https://geert.github.io/pexel-wallpaper/)

How to Use
To get started, follow these steps which are also displayed in the settings form of the application:

Mac OS
Install Plash:
Download and install Plash from the [Mac App Store](https://apps.apple.com/us/app/plash/id1494023538).
Add Web App to Plash:
In Plash preferences, under 'Websites', add this URL: https://geert.github.io/pexel-wallpaper/
Enable Browsing Mode:
Ensure 'Browsing Mode' is enabled in Plash for the URL above. This allows you to interact with the settings form directly on your desktop.
Windows
Install Lively:
Download and install from the [Microsoft Store](https://apps.microsoft.com/detail/9NTM2QC6QWS7)
Add Web App to Lively:
In Lively, choose the + button, add this URL: https://geert.github.io/pexel-wallpaper/
Configure Pexels Wallpaper
Enter Pexels API Key:
In the settings form (now visible on your desktop via Plash), enter your Pexels API key. You can get one from [Pexels API](https://www.pexels.com/api/key/).
Provide Pexels Collection URL:
Paste the URL of the Pexels collection you wish to use as your wallpaper source (e.g., https://www.pexels.com/collections/wallpapers-vmnecek/).
Start Slideshow:
Click "Apply Settings & Start Slideshow".
If you prefer to run without an API key, the app falls back to the local list in docs/pexels_photo_urls.txt. Refresh that list anytime by running python fetch_pexels_urls.py (requires PEXELS_API_KEY in your environment) or update the file manually with one image URL per line.

Updating Cached Wallpapers
Copy .env.example to .env and add your PEXELS_API_KEY.
Create a virtual environment and install Python dependencies: pip install -r requirements.txt.
Run python fetch_pexels_urls.py (or ./update.sh) to regenerate docs/pexels_photo_urls.txt with the latest items from your default collection.
Development
npm test – run the Jest unit tests.
npm run lint – check JavaScript (ESLint + Prettier) and Python (ruff) styling.
Your Desktop will now cycle through images from your selected Pexels collection!

Features
Direct integration with Pexels collections via their API.
User-friendly setup through an interactive form.
Multi-language support (EN, NL, DE, FR).
Fallback to local image URLs if no API key is provided (requires pexels_photo_urls.txt in the docs/ folder with image URLs, one per line).