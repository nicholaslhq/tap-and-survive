# Tap & Survive

**Tap & Survive** is a high-stakes local multiplayer survival game played on a single device. Gather your friends, tap to join, and see who has the luck to survive the chaos.

Built with **React 19**, **Vite**, and **TypeScript**, this project showcases fluid animations via **Framer Motion** and a responsive, modern design system using **Tailwind CSS**.

## 💡 Core Concept

Players compete in a fast-paced survival tapping game:
*   **Tap & Hold:** Each round, all players tap and hold anywhere on the screen.
*   **Suspense:** After a delay, one or more "danger zones" appear.
*   **Survive:** Players caught in danger zones lose, while safe players survive.

Victory depends on luck, survival, and strategy.

## 🎮 How to Play

1.  **Join the Lobby:** Each player touches (or clicks) the screen to spawn their avatar. Hold your position!
2.  **Wait for the Countdown:** detailed instructions will guide you, but keep your finger down.
3.  **Survive the Danger:** When the countdown ends, **Danger Zones** appear.
    *   **Classic Mode:** Avoid the red zones! If your finger is in a zone, you're out.
    *   **Survive Mode:** Test your endurance (and luck).
    *   **Reverse Mode:** Maybe you *want* to be in the zone?
4.  **Results:** See who survived and who was eliminated. Tap the button in the bottom-right to view full results.

## 🕹️ Game Modes & Difficulty

Customize your experience in the **Settings** menu:

1.  **Classic (Default)**
    *   Danger zones appear once per round.
    *   Multiple winners possible.
    *   Great for casual play and quick rounds.

2.  **Reverse**
    *   Players must tap *inside* the zone to survive.
    *   Multiple winners possible.
    *   Creating a "risk/reward" gameplay twist.

3.  **Survive**
    *   Danger zones keep appearing until only one player survives.
    *   Only one winner per round.
    *   Increases tension and strategic movement.

### Difficulty
*   **Easy, Medium, Hard:** Adjusts the size and number of danger zones to match your group's skill level.

## ⚙️ Installation and Setup

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (or yarn/pnpm)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nicholaslhq/tap-and-survive.git
    cd tap-and-survive
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:5173` (or the URL shown in the terminal).

## 🛠️ Tech Stack

*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Font:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)

## 📂 Project Structure

```
tap-and-survive/
├── components/         # tailored UI components and game logic views
│   ├── views/          # Home, Settings, and Result screens
│   ├── GameCanvas.tsx  # Core game rendering logic
│   └── ...
├── utils/              # Helper functions and logic
├── App.tsx             # Main application controller
├── types.ts            # TypeScript definitions for game state & models
├── index.html          # Entry point
└── vite.config.ts      # Vite configuration
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Credits

This project was created and is maintained solely by [Nicholas Lee](https://github.com/nicholaslhq). All aspects of the design, development, and implementation have been carried out independently.

Special thanks to:

-   **[Gemini AI](https://gemini.google.com/)**: For providing assistance and guidance throughout the development process.
-   **[Antigravity](https://antigravity.google/)**: For being an awesome pair programmer and helping with the implementation.

If you have any questions, feedback, or suggestions, please raise an issue on the [GitHub repository](https://github.com/nicholaslhq/tap-and-survive/issues). I welcome any input and will do my best to address your concerns.

Thank you for checking out the **Tap & Survive**!
