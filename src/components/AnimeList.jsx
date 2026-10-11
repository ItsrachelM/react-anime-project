import { useRef, useState } from 'react'

function randomIndex(length) {
  return Math.floor(Math.random() * length)
}

function AnimeList({ anime, selectedAnimeId, onSelect }) {
  const optionRefs = useRef([])
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAlphabetical, setIsAlphabetical] = useState(false)

  const orderedAnime = isAlphabetical
    ? [...anime].sort((first, second) => first.title.localeCompare(second.title))
    : anime
  const visibleAnime = orderedAnime.filter((item) =>
    item.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()),
  )

  function handleSearch(event) {
    event.preventDefault()
    setSearchQuery(searchInput.trim())
  }

  function clearSearch() {
    setSearchInput('')
    setSearchQuery('')
  }

  function handleKeyDown(event, currentIndex) {
    let nextIndex

    if (event.key === 'ArrowDown') nextIndex = Math.min(currentIndex + 1, visibleAnime.length - 1)
    else if (event.key === 'ArrowUp') nextIndex = Math.max(currentIndex - 1, 0)
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = visibleAnime.length - 1
    else return

    event.preventDefault()
    optionRefs.current[nextIndex]?.focus()
    onSelect(visibleAnime[nextIndex].id)
  }

  function pickRandomAnime() {
    if (visibleAnime.length === 0) return
    const randomAnime = visibleAnime[randomIndex(visibleAnime.length)]
    onSelect(randomAnime.id)
  }

  return (
    <section className="anime-list-panel" aria-label="Anime list">
      <form className="anime-search" role="search" onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="anime-search-input">Search anime titles</label>
        <input
          id="anime-search-input"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search titles…"
        />
        <button className="search-button" type="submit">Search</button>
      </form>

      <div className="anime-list-toolbar">
        <p className="anime-result-count" aria-live="polite">
          {searchQuery
            ? `${visibleAnime.length} of ${anime.length} titles`
            : `${anime.length} titles`}
        </p>
        <div className="anime-list-actions">
          {(searchInput || searchQuery) && (
            <button className="text-button" type="button" onClick={clearSearch}>
              Clear
            </button>
          )}
          <button
            className="text-button"
            type="button"
            aria-pressed={isAlphabetical}
            onClick={() => setIsAlphabetical((value) => !value)}
          >
            {isAlphabetical ? 'Original order' : 'A–Z'}
          </button>
          <button
            className="text-button surprise-button"
            type="button"
            disabled={visibleAnime.length === 0}
            onClick={pickRandomAnime}
          >
            Surprise me
          </button>
        </div>
      </div>

      {visibleAnime.length > 0 ? (
        <ul className="anime-list-items" role="listbox" aria-label="Anime titles">
          {visibleAnime.map((item, index) => (
            <li key={`${item.provider}-${item.id}`} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={item.id === selectedAnimeId}
                tabIndex={item.id === selectedAnimeId || (selectedAnimeId === null && index === 0) ? 0 : -1}
                ref={(element) => { optionRefs.current[index] = element }}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={item.id === selectedAnimeId ? 'anime-item-selected' : ''}
                onClick={() => onSelect(item.id)}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="anime-list-empty" role="status">
          {searchQuery ? 'No titles match your search.' : 'No anime available.'}
        </p>
      )}
    </section>
  )
}

export default AnimeList
