function AnimeList({ anime, onSelect }) {
  return (
    <ul>
      {anime.map((item) => (
        <li key={item.mal_id}>
          <button type="button" onClick={() => onSelect(item.mal_id)}>
            {item.title}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default AnimeList
