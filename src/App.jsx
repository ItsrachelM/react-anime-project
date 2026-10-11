import { useEffect, useState } from 'react'
import AnimeList from './components/AnimeList.jsx'
import Details from './components/Details.jsx'
import './App.css'

const ANIME_API_URL = 'https://api.jikan.moe/v4/top/anime?limit=25'

function App() {
  const [anime, setAnime] = useState([])
  const [isAnimeLoading, setIsAnimeLoading] = useState(true)
  const [selectedAnimeId, setSelectedAnimeId] = useState(null)
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch(ANIME_API_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load anime')
        return response.json()
      })
      .then((result) => {
        setAnime(result.data ?? [])
        setIsAnimeLoading(false)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch anime:', error)
          setIsAnimeLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (selectedAnimeId === null) return undefined

    const controller = new AbortController()
    setSelectedAnime(null)
    setIsDetailsLoading(true)

    fetch(`https://api.jikan.moe/v4/anime/${selectedAnimeId}/full`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load anime details')
        return response.json()
      })
      .then((result) => {
        setSelectedAnime(result.data)
        setIsDetailsLoading(false)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch anime details:', error)
          setIsDetailsLoading(false)
        }
      })

    return () => controller.abort()
  }, [selectedAnimeId])

  return (
    <main className="app-shell">
      <h1>Anime</h1>
      <section className="anime-layout" aria-label="Anime list">
        {isAnimeLoading ? (
          <div className="loading-indicator" role="status">
            <span className="loading-spinner" aria-hidden="true" />
            Loading anime…
          </div>
        ) : (
          <AnimeList
            anime={anime}
            selectedAnimeId={selectedAnimeId}
            onSelect={setSelectedAnimeId}
          />
        )}
        <Details anime={selectedAnime} isLoading={isDetailsLoading} />
      </section>
    </main>
  )
}

export default App
