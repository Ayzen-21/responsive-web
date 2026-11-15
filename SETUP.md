# Setup guide

## Required software

This project is a plain static website and requires only a modern browser and a simple way to serve files locally.

Recommended tools:

- Chrome, Edge, Firefox, or Safari
- A code editor such as VS Code
- Optional: Python for a local static server

## Dependencies

There are no package dependencies, build dependencies, or package manager install steps for the current project.

The app uses:

- HTML
- CSS
- plain JavaScript
- browser localStorage

## Project startup

### Quickest option

Open `budgetbasics.html` directly in a browser.

### Recommended option for local development

Run a simple static server from the project directory:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

On Windows PowerShell:

```powershell
py -m http.server 8000
```

## Environment and configuration

This project does not use environment variables, .env files, or a server configuration file.

The configuration that does exist is:

- `.vscode/chatbot.json` — local chatbot prompts and answer data

No API keys or secret credentials are required or expected for the current implementation.

## Browser behavior notes

Because the app uses browser storage, behavior can vary slightly depending on:

- browser privacy settings
- whether cookies or site data are cleared
- localStorage support in the browser

## Local data behavior

The app stores demo state in the browser, including:

- selected theme
- chosen country/currency
- goal data
- reserve plans
- pending items
- activity timeline
- user account data for the demo sign-in flow

This data is not sent to a backend server.

## Production setup

This is a static front-end project and can be hosted with any static file host.

Typical static hosting options:

- GitHub Pages
- Netlify
- Vercel static deployment
- a basic file server or CDN

### Basic deployment checklist

1. Upload the project folder to the hosting service.
2. Ensure the root document is `budgetbasics.html` or the hosting service is configured to serve the folder as a static site.
3. Confirm the browser can load `style.css` and `script.js` without 404 errors.
4. Verify localStorage-based features still work after deployment.

## Development notes

- There is no transpilation, bundling, or linting step.
- The project relies on standard browser JavaScript features and directly manipulates the DOM.
- Any added functionality should remain browser-only unless a backend is introduced later.

## Troubleshooting

### Scripts do nothing or the page is blank

- Ensure `script.js` is loading without a file path error.
- Check the browser console for JavaScript errors.
- Verify the DOM IDs referenced in `script.js` are present in the HTML.

### Theme or saved state does not persist

- Clear site data only if you intentionally want to reset the app state.
- Make sure the browser allows localStorage access.

### Chatbot is not responding appropriately

- Confirm `.vscode/chatbot.json` exists and is valid JSON.
- If the JSON fails to load, the app uses the built-in fallback answers embedded in `script.js`.

## Limitations of this setup

- No authentication server
- No production database
- No secure credential storage
- No real-time syncing across devices
- No external API integration

This project is intentionally designed as a browser-side learning and simulation tool, not as a production financial platform.
