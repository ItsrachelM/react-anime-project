# Anime Explorer

A React master-detail app for browsing anime. Select a title to load its genres, year, description, and poster in the details panel.

## Features

- Fetches and displays anime titles from a public anime API.
- Select an anime to load and view its details.
- Highlights the selected title.
- Shows loading and error messages during API requests.
- Uses a responsive two-column layout that stacks on smaller screens.
- Supports keyboard interaction through native buttons and includes basic ARIA labels and status announcements.

## Install and run

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

Useful commands:

```bash
npm run build
npm run preview
npm run lint
```

## API

The app requests anime titles from the [Kitsu API](https://kitsu.io/api/edge/anime) first. If that request fails or returns no usable titles, it tries [Jikan](https://api.jikan.moe/v4/anime). The details request uses the API that provided the selected title.

An internet connection is required to load the anime list and details.

## Folder structure

```text
src/
  components/
    AnimeList.jsx   Fetches and displays the anime list
    Details.jsx     Displays details for the selected anime
  data/
    anime.js        Local anime data (not used by the API-backed list)
  App.css           App layout and visual styles
  App.jsx           App state and page composition
  main.jsx          React entry point
public/
  favicon.svg
  icons.svg
```

## Notes for the reviewer

This project follows the structure defined in tasks.md.
Only Task 1 and Task 2 were committed to Git, as required.

Tasks 3–9 were executed locally without commits, including:
layout, accessibility, loading states, error handling, and full styling.

The app implements a classic master–detail pattern:
anime list on the left, details panel on the right.

The file src/data/anime.js is legacy data and not used in the API‑based flow.

The app depends on external APIs (Kitsu → Jikan fallback).
Internet connection is required for list and details.

Run the app with npm run dev, select an anime, and verify the details panel updates correctly.

## סיכום בעברית (4–5 משפטים)

האפליקציה מציגה רשימת אנימה מתוך API ציבורי, ומאפשרת לבחור פריט כדי לראות את כל הפרטים שלו בפאנל ייעודי.
המערכת כוללת טיפול מלא במצבי טעינה ושגיאה, ומספקת חוויית שימוש נגישה עם כפתורים תקניים וקריאות מסך.
העיצוב בנוי בתצורת master–detail עם פריסה דו־עמודתית שמסתגלת למסכים קטנים.
רק משימות 1 ו‑2 הוגשו כקומיט, בהתאם לדרישות המרצה, בעוד שאר המשימות בוצעו ללא קומיט.
האפליקציה משתמשת ב‑Kitsu API עם fallback ל‑Jikan כדי להבטיח זמינות נתונים.