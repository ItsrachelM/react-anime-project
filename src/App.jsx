import { useEffect, useRef, useState } from 'react'
import { fetchAnimeDetails, fetchAnimeList } from './api/anime.js'
import AnimeList from './components/AnimeList.jsx'
import Details from './components/Details.jsx'
import './App.css'

const ANIME_CACHE_KEY = 'anime-app-list-v1'

function readCachedAnime() {
  try {
    const cachedAnime = JSON.parse(localStorage.getItem(ANIME_CACHE_KEY) || '[]')
    return Array.isArray(cachedAnime) ? cachedAnime : []
  } catch {
    return []
  }
}

function App() {
  const [anime, setAnime] = useState(readCachedAnime)
  const [isAnimeLoading, setIsAnimeLoading] = useState(anime.length === 0)
  const hadCachedAnime = useRef(anime.length > 0)
  const [animeError, setAnimeError] = useState('')
  const [selectedAnimeId, setSelectedAnimeId] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    fetchAnimeList(controller.signal)
      .then((result) => {
        setAnime(result)
        try {
          localStorage.setItem(ANIME_CACHE_KEY, JSON.stringify(result))
        } catch {
          // Keep the app working when browser storage is unavailable or full.
        }
        setIsAnimeLoading(false)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch anime:', error)
          if (!hadCachedAnime.current) setAnimeError('Unable to load anime. Please try again later.')
          setIsAnimeLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!selectedItem) return undefined

    const controller = new AbortController()

    fetchAnimeDetails(selectedItem, controller.signal)
      .then((result) => {
        setSelectedAnime(result)
        setIsDetailsLoading(false)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch anime details:', error)
          setDetailsError('Unable to load these details. Please try selecting the anime again.')
          setIsDetailsLoading(false)
        }
      })

    return () => controller.abort()
  }, [selectedItem])

  function handleAnimeSelect(id) {
    if (id === selectedAnimeId) return
    setSelectedItem(anime.find((item) => item.id === id) ?? null)
    setSelectedAnime(null)
    setIsDetailsLoading(true)
    setDetailsError('')
    setSelectedAnimeId(id)
  }

  return (
    <main className="app-shell">
      <h1>Anime</h1>
      <section className="anime-layout" aria-label="Anime browser">
        {isAnimeLoading ? (
          <div className="loading-indicator" role="status">
            <span className="loading-spinner" aria-hidden="true" />
            Loading anime…
          </div>
        ) : animeError ? (
          <p className="error-message" role="alert">{animeError}</p>
        ) : (
          <AnimeList
            anime={anime}
            selectedAnimeId={selectedAnimeId}
            onSelect={handleAnimeSelect}
          />
        )}
        <Details
          anime={selectedAnime}
          isLoading={isDetailsLoading}
          error={detailsError}
        />
      </section>
    </main>
  )
}

export default App
