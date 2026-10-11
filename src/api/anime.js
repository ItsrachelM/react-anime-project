const ANILIST_URL = 'https://graphql.anilist.co'
const KITSU_URL = 'https://kitsu.io/api/edge'

async function requestJson(url, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 12000)
  const onAbort = () => controller.abort()

  if (options.signal?.aborted) controller.abort()
  else options.signal?.addEventListener('abort', onAbort, { once: true })

  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    if (!response.ok) throw new Error(`Anime API request failed (${response.status})`)
    return await response.json()
  } finally {
    clearTimeout(timeoutId)
    options.signal?.removeEventListener('abort', onAbort)
  }
}

async function requestAniList(query, variables, signal) {
  const result = await requestJson(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  })

  if (result.errors?.length || !result.data) {
    throw new Error(result.errors?.[0]?.message || 'AniList returned no data')
  }

  return result.data
}

function normalizeAniList(media) {
  return {
    id: media.id,
    provider: 'anilist',
    title: media.title?.english || media.title?.romaji || 'Untitled anime',
    genres: (media.genres ?? []).map((name) => ({ name })),
    year: media.startDate?.year ?? null,
    synopsis: media.description || '',
    images: {
      jpg: { large_image_url: media.coverImage?.extraLarge || media.coverImage?.large || '' },
    },
  }
}

function normalizeKitsu(item, included = []) {
  const attributes = item.attributes ?? {}

  return {
    id: item.id,
    provider: 'kitsu',
    title: attributes.titles?.en || attributes.titles?.en_jp || attributes.canonicalTitle || 'Untitled anime',
    genres: included
      .filter((entry) => entry.type === 'genres')
      .map((genre) => ({ name: genre.attributes?.name }))
      .filter((genre) => genre.name),
    year: attributes.startDate ? Number(attributes.startDate.slice(0, 4)) : null,
    synopsis: attributes.synopsis || '',
    images: {
      jpg: { large_image_url: attributes.posterImage?.large || attributes.posterImage?.original || '' },
    },
  }
}

const animeFields = `
  id
  title { english romaji }
  description(asHtml: false)
  startDate { year }
  genres
  coverImage { large extraLarge }
`

export async function fetchAnimeList(signal) {
  try {
    const result = await requestAniList(
      `query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(type: ANIME, sort: POPULARITY_DESC) { ${animeFields} }
        }
      }`,
      { page: 1, perPage: 25 },
      signal,
    )
    const anime = result.Page.media.map(normalizeAniList)
    if (anime.length === 0) throw new Error('AniList returned an empty anime list')
    return anime
  } catch (anilistError) {
    if (signal?.aborted) throw anilistError

    const result = await requestJson(
      `${KITSU_URL}/anime?page%5Blimit%5D=25&sort=popularityRank`,
      { signal },
    )
    if (!Array.isArray(result.data)) throw anilistError
    return result.data.map((item) => normalizeKitsu(item))
  }
}

async function fetchAniListDetails(id, signal) {
  const result = await requestAniList(
    `query ($id: Int) { Media(id: $id, type: ANIME) { ${animeFields} } }`,
    { id: Number(id) },
    signal,
  )
  if (!result.Media) throw new Error('Anime not found on AniList')
  return normalizeAniList(result.Media)
}

async function searchAniList(title, signal) {
  const result = await requestAniList(
    `query ($search: String) { Media(search: $search, type: ANIME) { ${animeFields} } }`,
    { search: title },
    signal,
  )
  if (!result.Media) throw new Error('Anime not found on AniList')
  return normalizeAniList(result.Media)
}

async function fetchKitsuDetails(id, signal) {
  const result = await requestJson(`${KITSU_URL}/anime/${encodeURIComponent(id)}?include=genres`, { signal })
  if (!result.data) throw new Error('Anime not found on Kitsu')
  return normalizeKitsu(result.data, result.included ?? [])
}

async function searchKitsu(title, signal) {
  const query = new URLSearchParams({ 'filter[text]': title, 'page[limit]': '5', include: 'genres' })
  const result = await requestJson(`${KITSU_URL}/anime?${query}`, { signal })
  if (!Array.isArray(result.data) || result.data.length === 0) {
    throw new Error('Anime not found on Kitsu')
  }

  return normalizeKitsu(result.data[0], result.included ?? [])
}

export async function fetchAnimeDetails(anime, signal) {
  if (anime.provider === 'kitsu') {
    try {
      return await fetchKitsuDetails(anime.id, signal)
    } catch (kitsuError) {
      if (signal?.aborted) throw kitsuError
      return searchAniList(anime.title, signal)
    }
  }

  try {
    return await fetchAniListDetails(anime.id, signal)
  } catch (anilistError) {
    if (signal?.aborted) throw anilistError
    return searchKitsu(anime.title, signal)
  }
}
