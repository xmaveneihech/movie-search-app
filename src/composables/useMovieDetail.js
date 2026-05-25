import { ref } from 'vue'

const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE_URL = 'https://www.omdbapi.com/'

/**
 * Composable for fetching a single movie's full details by IMDb ID.
 */
export function useMovieDetail() {
  const movie   = ref(null)
  const loading = ref(false)
  const error   = ref('')

  /**
   * @param {string} imdbID - IMDb ID (e.g. "tt1234567")
   */
  async function fetchMovie(imdbID) {
    loading.value = true
    error.value   = ''
    movie.value   = null

    try {
      const params = new URLSearchParams({ i: imdbID, apikey: API_KEY })
      const res    = await fetch(`${BASE_URL}?${params}`)
      if (!res.ok) throw new Error(`Network error: ${res.status}`)

      const data = await res.json()

      if (data.Response === 'True') {
        movie.value = data
      } else {
        error.value = data.Error || 'Movie not found.'
      }
    } catch (err) {
      error.value = 'Failed to load movie details.'
      console.error('[useMovieDetail]', err)
    } finally {
      loading.value = false
    }
  }

  return { movie, loading, error, fetchMovie }
}