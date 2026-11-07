---
name: "Azure Push Notification Explorer extension for VS Code"
tagline: "Browse Azure Notification Hub device registrations, search by tag, and send test notifications like the classic Visual Studio Notification Hub Explorer"
author: "Sagar Dahal"
author_github: "chaosifier"
github_url: "https://github.com/chaosifier/notification-hub-explorer"
thumbnail: "/thumbnails/azure-push-notification-explorer-extension-for-vs-code.webp"
website_url: "https://marketplace.visualstudio.com/items?itemName=chaosifier.notification-hub-explorer"
thumbnail_source: "https://github.com/chaosifier/notification-hub-explorer/blob/main/media/icon.png"
tags: ["azure", "notification hub", "push", "apns", "fcm"]
language: "TypeScript"
license: "MIT"
theme: "minimal"
date_added: "2026-11-07"
featured: false
---

# Azure Notification Hub Explorer for VS Code

Browse device registrations, search them by tag, and send test notifications to an Azure Notification Hub from VS Code. It works like the old **Notification Hub Explorer** in Visual Studio (Server Explorer → Notification Hubs).

## Features

- **Hubs view** in the activity bar (bell icon). Add as many hubs as you like. Connection strings are kept in VS Code's encrypted SecretStorage.
- **Device Registrations** tab
  - Lists every registration with paging (**Load more**), or searches by **tag**. You can also click any tag chip to search for it.
  - Filter the loaded rows by text or platform, and sort by any column.
  - View the full registration JSON, **edit tags**, copy the PNS handle, delete one or several registrations, and export the list as JSON.
  - **Send** on a row opens Test Send ready to target that device's handle.
- **Test Send** tab
  - Platforms: Apple (APNS), FCM v1, FCM legacy, Windows (toast, tile, badge, raw), Template, ADM, Baidu, Xiaomi, and Browser.
  - Send to all devices, a **tag expression** (e.g. `user:123 || (sports && !scores)`), or a single **device handle**.
  - Each platform starts with a sample payload. You can add custom headers as JSON.
  - **Test send** mode returns the outcome for each registration (success, or why it failed) and delivers to at most 10 devices.
  - Every send is also logged to the *Notification Hub Explorer* output channel.




## Getting started

1. In the Azure portal, open your Notification Hub → **Access Policies** and copy a connection string.
   - Use `DefaultFullSharedAccessSignature` (Listen, Manage, Send) if you want to list, edit, or delete registrations.
   - `DefaultListenSharedAccessSignature` is **not** enough to send notifications or list registrations.
2. Click the bell icon → **Add Notification Hub**, then paste the connection string and enter the hub name.
3. Click the hub to open the explorer. Use the inline icons to jump straight to **Send Test Notification** or **Search Registrations by Tag**.

## Notes and limitations

- Tag search (`listRegistrationsByTag`) matches a **single tag exactly**. Tag *expressions* are only supported when sending.
- The tool works with *registrations*. *Installations* aren't listed, because the service has no API to enumerate them.
- Per-device outcomes are only returned for test sends. A direct send to a device handle can't be a test send.
- Setting: `notificationHubExplorer.registrationPageSize` (1–100, default 100).