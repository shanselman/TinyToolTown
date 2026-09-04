---
name: "roarwpm-type-test"
tagline: "A modern and responsive WPM typing trainer featuring real-time speed monitoring, dynamic burst animations, customizable test durations, and a detailed historical progress chart to track your typing improvement over time."
author: "Vishnu Pradeep"
author_github: "pradeep-vishnu"
github_url: "https://github.com/pradeep-vishnu/roarwpm-type-test"
website_url: "https://pradeep-vishnu.github.io/roarwpm-type-test/"
thumbnail_source: "https://github.com/pradeep-vishnu/roarwpm-type-test/blob/main/demo.png"
tags: ["wpm", "touch-typing", "type-learning", "words-per-minute", "typing-speed"]
language: "html"
license: "MIT License"
theme: "newspaper"
date_added: "2026-08-18"
featured: false
---

# 🐻 RoarWPM

RoarWPM is an interactive, web-based typing speed test application designed to help users track and improve their typing speed and accuracy. This project features a clean dark-mode interface, gamified achievements, and detailed performance tracking.

---

## 🚀 Features

* **Customizable Test Duration**: Users can adjust the test timer from 15 seconds up to 120 seconds using an interactive slider.
* **Live Speed Meter**: The application provides a dynamic speed bar and real-time motivational messages (such as "🔥 LEGENDARY SPEED! 🔥" or "🚀 GREAT SPEED! 🚀") based on your current typing pace.
* **Real-Time Statistics**: Words Per Minute (WPM) and typing accuracy percentage are continuously calculated and displayed while you type.
* **Visual Typing Feedback**: The text interface highlights correct letters, marks incorrect keystrokes with a red background, and features a blinking cursor line under the active character.
* **User Profiles & Local Storage**: The app asks for a username upon loading and saves it alongside your past score history using the browser's local storage, allowing you to track progress across sessions.
* **Data Visualization**: Integrates Chart.js to generate line graphs that show your WPM progression during a specific test, as well as historical WPM trends across all your recorded tests.
* **End Session Dashboard**: Ending a session triggers a dynamic "fly away" animation and reveals a goodbye screen featuring your overall WPM history chart.

---

## 🏆 Achievements to Unlock

The application includes a built-in badge system to reward typing milestones:

| Icon | Title | Description | Target |
| :---: | :--- | :--- | :--- |
| 🥚 | **Novice Typist** | Complete your first test | 1 Test |
| 🐾 | **Dedicated Bear** | Complete 10 tests | 10 Tests |
| 🏎️ | **Speed Demon** | Reach 60 WPM | 60 WPM |
| ⚡ | **Godlike Speed** | Reach 100 WPM | 100 WPM |
| 🎯 | **Sharpshooter** | Get 100% Accuracy on a test | 1 Perfect Test |
| 💎 | **Flawless Master** | Get 100% Accuracy on 5 tests | 5 Perfect Tests |

---

## 💻 Used

* **HTML/CSS/JavaScript**: Built entirely with vanilla web technologies, utilizing CSS keyframe animations for dynamic visual effects.
* **Chart.js (v3.9.1)**: Imported via CDN to render interactive performance graphs within the results modal and dashboard.

---

## 🛠️ How to Run

Online: Click here [RoarWPM by VP]([https://todo](https://pradeep-vishnu.github.io/roarwpm-type-test/))

Locally: 
1. Create a new file named `.html`.
2. Copy the provided source code and paste it into the file.
3. Save the file and open it in any modern web browser to start typing.
