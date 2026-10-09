import anime from '../data/anime.js'

export default function AnimeList() {
  return (
    <ul>
      {anime.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}
