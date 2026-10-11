function AnimeList({ anime, selectedAnimeId, onSelect }) {
  return (
    <ul>
      {anime.map((item) => (
        <li key={item.mal_id}>
          <button
            type="button"
            className={item.mal_id === selectedAnimeId ? 'anime-item-selected' : ''}
            onClick={() => onSelect(item.mal_id)}
          >
            {item.title}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default AnimeList
