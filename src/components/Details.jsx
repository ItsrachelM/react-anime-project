function Details({ anime, isLoading, error }) {
  return (
    <section className="details-panel" aria-labelledby="details-heading" aria-live="polite">
      <h2 id="details-heading">Details</h2>
      {isLoading ? (
        <div className="loading-indicator" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          Loading details…
        </div>
      ) : error ? (
        <p className="error-message" role="alert">{error}</p>
      ) : anime ? (
        <article className="anime-details">
          <h3>{anime.title}</h3>
          <p className="anime-genres">
            {anime.genres?.map((genre) => genre.name).join(' · ') || 'Genres unavailable'}
          </p>
          <p className="anime-year">
            {anime.year ?? anime.aired?.prop?.from?.year ?? 'Year unavailable'}
          </p>
          <p className="anime-description">
            {anime.synopsis || 'No description available.'}
          </p>
          {anime.images?.jpg?.large_image_url && (
            <img
              className="anime-poster"
              src={anime.images.jpg.large_image_url}
              alt={`${anime.title} poster`}
            />
          )}
        </article>
      ) : (
        <p className="details-empty-state">Select an anime to see its details.</p>
      )}
    </section>
  )
}

export default Details
