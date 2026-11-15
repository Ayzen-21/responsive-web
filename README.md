# BudgetBasics

BudgetBasics is a student-friendly budgeting education website built as a static front-end app. It teaches budgeting fundamentals, helps users classify needs vs. wants, demonstrates the 50-30-20 rule, and provides lightweight savings-planning simulations. All of the interactive behavior runs in the browser and persists locally on the device using localStorage.

## Project overview

This project is designed to help students learn practical money habits without requiring a real account, backend service, or bank connection. The app includes:

- a budgeting basics learning section
- a needs vs. wants classification exercise
- a 50-30-20 calculator for regular and irregular income
- a local savings allowance vault
- savings goal planning and simulated withdrawals
- a simple savings health tracker
- a gallery of budgeting infographics
- a lightweight AI-style chatbot driven by local JSON data
- a feedback form and optional demo account flow

## Main features

- Educational budget guidance for students
- Interactive quiz and item classification game
- Currency/country selector with sample value scaling
- Theme toggle for light and dark mode
- Savings goal lifecycle: create, edit, pause, archive, duplicate, delete
- Rigid vs. flexible goal modes with simulated early-withdrawal behavior
- Local tracking for pending items and reserve planning
- Local persistence using browser storage for demo data
- Export/import/reset controls for the simulated savings workspace
- Custom chatbot responses drawn from `.vscode/chatbot.json`

## How the site works

BudgetBasics is a single-page website. Visitors move between sections using the navigation links, and the page updates interactive content without opening a new page or contacting a server.

1. The browser loads `budgetbasics.html`, then applies the visual design from `style.css` and the behavior from `script.js`.
2. The page starts with learning content, sample budget cards, a rotating tip, and a 50-30-20 visual example. The selected country changes the displayed currency and scales sample values for demonstration.
3. Interactive lessons respond immediately in the browser. The quiz checks answers, the Needs vs. Wants activity classifies selected items, and the budget calculator validates income before showing the needs, wants, and savings amounts.
4. Planning tools let visitors create savings goals, add upcoming expenses or deposits, set an allowance release schedule, and simulate withdrawals. JavaScript calculates progress, estimated completion dates, totals, and savings health, then redraws the relevant parts of the page.
5. When a feature needs to remember something, the app converts the data to JSON and stores it in the browser's `localStorage`. Reloading the page restores saved goals, preferences, activity, reserve plans, pending items, and demo account state on that same browser and device.
6. The theme button, country selector, account dialog, export/import/reset controls, and chatbot are also browser-side features. The chatbot reads local responses from `.vscode/chatbot.json` and uses fallback data if that file cannot be loaded.

No real money is moved, no bank account is connected, and no user data is sent to a backend. The account and savings features are simulations for learning and personal planning in the browser.

### How the private allowance vault works

The allowance vault is a controlled savings simulation:

1. The user enters an allowance amount and chooses a weekly, every-two-weeks, or monthly release schedule.
2. The vault reserves 20% of that amount as savings. Needs and wants are not placed in the vault.
3. On each scheduled date, the savings installment becomes available and the next release date is calculated.
4. If the user needs the money before the scheduled date, the site shows the amount they would receive and a 5% early-withdrawal fee. For example, an early withdrawal of `$100` releases `$95`, while `$5` is recorded as the fee.

The vault does not currently impose a time-based waiting period. The fee is the pause mechanism: it makes the cost visible before the user confirms whether to take the savings out. This is a budgeting exercise, not a bank account, so the fee is only simulated.

### How locked savings goals work

When a user creates a goal, they set a target, current amount, monthly contribution, start date, unlock date, and mode:

- **Rigid goal:** stays locked until the chosen date. An early withdrawal opens a review confirmation showing the withdrawal amount, the 1% fee, the amount received, and the balance remaining. The user can cancel the review to keep the savings locked.
- **Flexible goal:** allows an early withdrawal without a penalty, so it is useful when the user needs more control.

For a rigid goal, withdrawing `$100` before the unlock date means `$1` is simulated as the fee and `$99` is received. The site does not remove the money until the user confirms the review. After confirmation, the balance, activity history, progress, and savings health score are updated and saved locally.

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage for persistence
- No framework, no backend, no database
- Optional static hosting (GitHub Pages, Netlify, Vercel, or any static server)

## Project structure

```text
.
├── budgetbasics.html      # Main page markup and UI sections
├── script.js              # Client-side logic, state, rendering, storage, interactions
├── style.css              # Layout, colors, responsive styling, dark mode, accessibility
├── .vscode/
│   └── chatbot.json       # Local chatbot knowledge base and prompts
├── README.md              # Project documentation
├── ARCHITECTURE.md        # High-level architecture and data flow
├── SETUP.md               # Local setup and static hosting notes
└── .vscode/
	└── chatbot.json       # Local chatbot knowledge base
```

## Prerequisites

- A modern browser such as Chrome, Edge, Firefox, or Safari
- A local static file server is optional but recommended for best behavior
- No package manager or build tool is required

## Installation

1. Clone or download the project folder.
2. Open the project directory in a text editor or IDE.
3. Serve the folder locally, or open `budgetbasics.html` directly in a browser.

## Environment variables

This project does not require environment variables or a backend configuration file.

The only notable configuration file is:

- `.vscode/chatbot.json` — contains static chatbot prompts and answer data

No secrets or keys are required for the current application behavior.

## How to run locally

### Option 1: Open directly in a browser

Open `budgetbasics.html` in a browser.

### Option 2: Serve the folder locally

From the project directory, run one of the following:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

On Windows PowerShell, this also works:

```powershell
py -m http.server 8000
```

## Available scripts

This project does not include a `package.json` or npm scripts. The app is a static front-end with browser-based logic only.

## Build instructions

No build step is required.

The app is static and can be served as-is. If changes are made to the HTML, CSS, or JavaScript, reload the browser to reflect them.

## Deployment instructions

Because there is no server-side code, deployment is straightforward:

1. Upload the project folder to any static hosting provider.
2. Ensure the root points to the main HTML page.
3. For a simple deployment, serve the folder as static files.

Examples of suitable deployment environments:

- GitHub Pages
- Netlify
- Vercel static hosting
- Any simple static file server

## Main application workflows

### 1. Learning workflow

User opens the site, reads the basics overview, uses the quiz, classifies needs vs. wants, and studies the 50-30-20 rule.

### 2. Budget calculation workflow

User enters income in the calculator and chooses between regular or irregular income. The JS calculates needs, wants, and savings allocations and displays them in the result panel.

### 3. Goal planning workflow

User creates a goal with a target, current savings, monthly contribution, and unlock date. The app estimates progress, remaining amount, and possible completion time.

### 4. Savings health workflow

The app reviews savings goal progress, reserve progress, contribution activity, and recent withdrawals to produce a 0-100 savings health indicator.

### 5. Local data workflow

The app saves goals, activity, reserve planning, account data, preferences, and pending items to localStorage. Export/import/reset actions help users manage demo data in the browser.

### 6. Chatbot workflow

The floating assistant reads `.vscode/chatbot.json` and uses its local answer dataset to generate matches for budgeting prompts.

## Troubleshooting

### The page does not look right

- Confirm that `style.css` is loading correctly.
- Check that the HTML references the stylesheet path exactly.
- Verify there are no browser cache issues by refreshing the page.

### The calculator or goal logic is not updating

- Check the browser console for runtime errors.
- Confirm `script.js` is loaded after the DOM elements.
- Verify that the page elements referenced in the script still exist in the HTML.

### Local data is not persisting

- This app stores data in browser localStorage.
- Data is tied to the current browser/device profile.
- If the browser blocks storage or the user clears site data, the saved demo data will disappear.

### The chatbot is not responding as expected

- Confirm `.vscode/chatbot.json` exists and is valid JSON.
- Check the browser console for fetch or parsing errors.
- If the JSON file is unavailable, the app falls back to a built-in fallback configuration inside `script.js`.

## Known limitations

- This project is a front-end demo and has no server-side database.
- All user-generated data is stored locally in the browser only.
- There is no real authentication backend, no real payment processing, and no real financial advice engine.
- Currency conversion is a demo representation, not live market data.
- The chatbot is rule-based and uses static local content rather than a live AI service.
- The app deliberately uses educational and simulated values; it should not be treated as a real financial planning system.

## Notes for maintainers

- The UI is structured in one large HTML file with multiple sections and interactive blocks.
- Most logic is centralized in `script.js`, which renders many UI states dynamically.
- Styling is driven by CSS variables and theme attributes, especially the `data-t="dark"` toggle.
- Local persistence is intentionally client-only; any new feature that needs trustworthy multi-user data would require a backend and database.

## Summary

BudgetBasics is a static educational budgeting app with simulated money tools. Its value is in teaching concepts and running browser-only demos, not in processing real money or real user accounts. The project is intentionally lightweight, portable, and easy to host as a static website.
