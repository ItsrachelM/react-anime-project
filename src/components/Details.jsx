export default function Details({ selectedAnime, isLoading, error }) {
  return (
    <section className="details-panel" aria-labelledby="details-heading" aria-live="polite">
      <h2 id="details-heading">Details</h2>
      {isLoading ? (
        <div className="loading-indicator" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          <span>Loading details…</span>
        </div>
      ) : error ? (
        <p className="error-message" role="alert">{error}</p>
      ) : selectedAnime ? (
        <article className="anime-details">
          <h3>{selectedAnime.title}</h3>
          <p className="anime-genres">
            {selectedAnime.genres.length ? selectedAnime.genres.join(' · ') : 'Genres unavailable'}
          </p>
          <p className="anime-year">{selectedAnime.year || 'Year unavailable'}</p>
          <p className="anime-description">
            {selectedAnime.description || 'Description unavailable'}
          </p>
          {selectedAnime.poster && (
            <img className="anime-poster" src={selectedAnime.poster} alt={`Poster for ${selectedAnime.title}`} />
          )}
        </article>
      ) : (
        <p className="details-empty-state">Select an anime from the list to see its details.</p>
      )}
    </section>
  )
}
