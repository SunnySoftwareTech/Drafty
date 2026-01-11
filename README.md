# Drafty

Drafty is a modern, offline-first study workspace built with TypeScript, React, and Vite. It includes notebooks with dynamic page numbering, projects, independent flashcards, a whiteboard, and a settings panel for themes and data import/export.

## Features

- **Notebooks** – Organize your notes with unlimited pages. Pages have dynamic page numbers that adjust automatically as you reorder them.
- **Projects** – Group multiple notebooks for classes or study goals
- **Flashcards** – Independent flashcard system (no notebook required) for studying anywhere
- **Whiteboard** – Freeform drawing and brainstorming canvas
- **Study Mode** – Spaced repetition with your flashcards
- **Themes** – 6 Catppuccin color presets with Dark/Light mode and custom accent colors
- **Customizable Editor** – Adjust text color, font size, and font family per session
- **Cross-Platform** – Works on Windows, macOS, Linux, and ChromeOS

## Data storage and portability

Drafty stores your content in the browser (localStorage), namespaced per Firebase user.

- Private to your device/browser profile
- Works offline after the app loads
- Not automatically synced across devices

To move data between devices/browsers, use **Settings → Files**:
- **Export** – Download your data as JSON
- **Import** – Restore from a JSON file
- **Clear** – Delete all data for a category

This approach is cross-platform by default because it relies on standard web APIs, not OS-specific file paths.

## Key workflows

### Pages and page numbers
In **Notebook mode**, when you add pages to a book, each page gets a dynamic page number (Page 1, Page 2, etc.). These numbers are calculated based on the `order` field, not hard-coded to the page. Use the **↑** and **↓** buttons in the page list to shuffle pages; the numbers automatically update to reflect the new order.

### Flashcards without notebooks
**Flashcards mode** is completely independent—you don't need notebooks to create flashcards. Add questions and answers directly, then study them with spaced repetition in Study mode.

### Light mode
When you enable Light mode in Settings, all SVG icons and borders automatically darken to ensure visibility. Accent colors are also adjusted for readability on light backgrounds.

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

Open http://localhost:5173.

### Build

```bash
npm run build
```

Outputs to `dist/`.

## Firebase authentication

This project uses Firebase for authentication. To use your own Firebase project:

1. Create a `.env` file in the project root
2. Add your Firebase config variables (see `src/firebase.ts` for the expected variable names)

Example `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Deployment

Drafty can be deployed to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Then deploy the dist/ folder
```

See [vercel.json](vercel.json) for Vercel-specific config.

## Browser compatibility

Drafty works on all modern browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile.

## License

MIT
