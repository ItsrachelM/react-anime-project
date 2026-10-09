# PROMPTS

## Task 1 — Fetch anime list from a public API

**Prompt:** Fetch and display anime titles from a public API. Try Kitsu first and use another free anime API if it fails. Show loading and error states.

**Agent did:** Updated App.jsx and src/components/AnimeList.jsx. The list fetches from Kitsu first and falls back to Jikan, with loading and error states.

**I checked:** I reviewed the API fetching and fallback behavior in the source code. I did not run the app for this check.

## Task 2 — Show details when clicking an item

**Prompt:** When the user selects an anime, fetch its full details from the API and display the title, genres, year, description, and poster in the details panel.

**Agent did:** Updated App.jsx and src/components/AnimeList.jsx to handle selection and fetch details. Created src/components/Details.jsx to display the fetched information and request states.

**I checked:** I reviewed the selection flow and the fields rendered by Details.jsx. I did not run the app for this check.
