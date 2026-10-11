import { useEffect, useState } from 'react'
import AnimeList from './components/AnimeList.jsx'
import './App.css'

const ANIME_API_URL = 'https://api.jikan.moe/v4/top/anime?limit=25'

function App() {
  const [anime, setAnime] = useState([])
  const [selectedAnimeId, setSelectedAnimeId] = useState(null)
  const [selectedAnime, setSelectedAnime] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(ANIME_API_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load anime')
        return response.json()
      })
      .then((result) => setAnime(result.data ?? []))
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('Failed to fetch anime:', error)
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (selectedAnimeId === null) return undefined

    const controller = new AbortController()
    setSelectedAnime(null)

    fetch(`https://api.jikan.moe/v4/anime/${selectedAnimeId}/full`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load anime details')
        return response.json()
      })
      .then((result) => setSelectedAnime(result.data))
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('Failed to fetch anime details:', error)
      })

    return () => controller.abort()
  }, [selectedAnimeId])

  return (
    <main className="app-shell">
      <h1>Anime</h1>
      <section className="anime-layout" aria-label="Anime list">
        <AnimeList anime={anime} onSelect={setSelectedAnimeId} />
        <section className="details-panel" aria-label="Anime details">
          <h2>Details</h2>
          {selectedAnime ? (
            <article className="anime-details">
              <h3>{selectedAnime.title}</h3>
              <p className="anime-genres">
                {selectedAnime.genres?.map((genre) => genre.name).join(' · ') || 'Genres unavailable'}
              </p>
              <p className="anime-year">
                {selectedAnime.year ?? selectedAnime.aired?.prop?.from?.year ?? 'Year unavailable'}
              </p>
              <p className="anime-description">
                {selectedAnime.synopsis || 'No description available.'}
              </p>
              {selectedAnime.images?.jpg?.large_image_url && (
                <img
                  className="anime-poster"
                  src={selectedAnime.images.jpg.large_image_url}
                  alt={`${selectedAnime.title} poster`}
                />
              )}
            </article>
          ) : (
            <p className="details-empty-state">Select an anime to see its details.</p>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
