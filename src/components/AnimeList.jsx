import { useEffect, useState } from 'react'

const ANIME_API_URLS = [
  { url: 'https://kitsu.io/api/edge/anime', api: 'kitsu' },
  { url: 'https://api.jikan.moe/v4/anime', api: 'jikan' },
]

function getAnimeList(payload, api) {
  if (!Array.isArray(payload.data)) {
    throw new Error('The anime API returned an invalid response.')
  }

  const anime = payload.data.map((item) => api === 'kitsu'
    ? {
        id: item.id,
        title: item.attributes?.canonicalTitle || item.attributes?.titles?.en || item.attributes?.titles?.en_jp,
        api,
      }
    : {
        id: item.mal_id,
        title: item.title_english || item.title,
        api,
      })
    .filter((item) => item.id && item.title)

  if (anime.length === 0) {
    throw new Error('The anime API returned no titles.')
  }

  return anime
}

export default function AnimeList({ selectedAnime, onSelectAnime }) {
  const [anime, setAnime] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadAnime() {
      try {
        let loadedAnime

        for (const provider of ANIME_API_URLS) {
          try {
            const response = await fetch(provider.url, { signal: controller.signal })
            if (!response.ok) {
              throw new Error(`Request failed (${response.status})`)
            }

            loadedAnime = getAnimeList(await response.json(), provider.api)
            break
          } catch (apiError) {
            if (apiError.name === 'AbortError') {
              throw apiError
            }
          }
        }

        if (!loadedAnime) {
          throw new Error('All anime APIs failed to return titles.')
        }

        setAnime(loadedAnime)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError('Unable to load anime. Please try again later.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadAnime()
    return () => controller.abort()
  }, [])

  if (isLoading) {
    return (
      <div className="loading-indicator" role="status">
        <span className="loading-spinner" aria-hidden="true" />
        <span>Loading…</span>
      </div>
    )
  }

  if (error) {
    return <p className="error-message" role="alert">{error}</p>
  }

  return (
    <ul aria-label="Anime list">
      {anime.map((item) => {
        const isSelected = selectedAnime?.api === item.api && selectedAnime?.id === item.id

        return (
          <li key={`${item.api}-${item.id}`}>
            <button
              type="button"
              className={isSelected ? 'anime-item-selected' : undefined}
              aria-pressed={isSelected}
              onClick={() => onSelectAnime(item)}
            >
              {item.title}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
