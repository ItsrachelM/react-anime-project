import { useEffect, useState } from 'react'
import AnimeList from './components/AnimeList.jsx'
import Details from './components/Details.jsx'
import './App.css'

function getAnimeDetails(payload, api) {
  if (api === 'kitsu') {
    const attributes = payload.data.attributes
    const genres = (payload.included || [])
      .filter((item) => item.type === 'genres')
      .map((item) => item.attributes.name)

    return {
      title: attributes.canonicalTitle || attributes.titles?.en || attributes.titles?.en_jp,
      genres,
      year: attributes.startDate?.slice(0, 4),
      description: attributes.synopsis,
      poster: attributes.posterImage?.original || attributes.posterImage?.large,
    }
  }

  const anime = payload.data
  return {
    title: anime.title_english || anime.title,
    genres: (anime.genres || []).map((genre) => genre.name),
    year: anime.year || anime.aired?.prop?.from?.year,
    description: anime.synopsis,
    poster: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
  }
}

function App() {
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [animeDetails, setAnimeDetails] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState('')

  useEffect(() => {
    if (!selectedAnime) return undefined

    const controller = new AbortController()
    const detailsUrl = selectedAnime.api === 'kitsu'
      ? `https://kitsu.io/api/edge/anime/${encodeURIComponent(selectedAnime.id)}?include=genres`
      : `https://api.jikan.moe/v4/anime/${encodeURIComponent(selectedAnime.id)}/full`

    async function loadDetails() {
      setAnimeDetails(null)
      setDetailsError('')
      setIsLoadingDetails(true)

      try {
        const response = await fetch(detailsUrl, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }

        const payload = await response.json()
        setAnimeDetails(getAnimeDetails(payload, selectedAnime.api))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setDetailsError('Unable to load anime details. Please try again later.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingDetails(false)
        }
      }
    }

    loadDetails()
    return () => controller.abort()
  }, [selectedAnime])

  return (
    <main className="app-shell">
      <h1>Anime Explorer</h1>
      <div className="anime-layout">
        <AnimeList selectedAnime={selectedAnime} onSelectAnime={setSelectedAnime} />
        <Details
          selectedAnime={animeDetails}
          isLoading={isLoadingDetails}
          error={detailsError}
        />
      </div>
    </main>
  )
}

export default App


