# PRD: Anime Explorer

## 1. One-sentence pitch
Anime Explorer lets people browse anime titles from a public API and see details for the title they select.

## 2. Who it is for
Anime fans who want a simple way to discover titles and view basic information about them.

## 3. Screens (list + details)
- **List:** Shows anime titles fetched from a public API. The selected title is highlighted.
- **Details:** Shows the selected anime’s title, genres, year, description, and poster. Loading and error states appear when needed.

## 4. Must-have features
- Load anime titles from Kitsu, with Jikan as a fallback if Kitsu fails or returns no usable titles.
- Select a title and fetch its details from the API that supplied it.
- Display title, genres, year, description, and poster in a master-detail layout.
- Show loading and clear error states for API requests.
- Support keyboard selection and provide basic accessible labels and announcements.

## 5. Acceptance criteria
When I open the app, I see anime titles loaded from a public API.
When I select a title, I see its title, genres, year, description, and poster in the details panel.
When anime data is loading, I see a loading indicator.
When an API request fails, I see a clear error message.

## 6. Not now (future ideas)
Search and filtering, favorites, pagination, and user accounts are future ideas.

## 7. Data: API URL + fields used
The app first requests the Kitsu anime list at https://kitsu.io/api/edge/anime. It uses the anime ID and title from `attributes.canonicalTitle`, `attributes.titles.en`, or `attributes.titles.en_jp`. For details it requests the selected anime with genres included, and uses `attributes.startDate`, `attributes.synopsis`, `attributes.posterImage.original` or `attributes.posterImage.large`, and the included genre names.

If Kitsu fails or returns no usable titles, the app uses Jikan at https://api.jikan.moe/v4/anime. It uses `mal_id` and `title_english` or `title` for the list. For details it uses `genres[].name`, `year` or `aired.prop.from.year`, `synopsis`, and `images.webp.large_image_url` or `images.jpg.large_image_url`.
