import { ref, computed } from 'vue'

const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE_URL = 'https://www.omdbapi.com/'

/**
 * Composable for searching movies via OMDb API.
 * Handles fetching, loading state, errors, and pagination metadata.
 */
export function useMovieSearch() {
  const movies      = ref([])
  const loading     = ref(false)
  const error       = ref('')
  const totalResults = ref(0)

  // OMDb returns 10 results per page
  const RESULTS_PER_PAGE = 10

  const totalPages = computed(() =>
    Math.ceil(totalResults.value / RESULTS_PER_PAGE)
  )

  /**
   * Fetch movies from OMDb search endpoint.
   * @param {string} query  - Search term
   * @param {number} page   - Page number (1-based)
   * @param {string} type   - 'all' | 'movie' | 'series'
   */
  async function searchMovies(query, page = 1, type = 'all') {
    if (!query.trim()) {
      movies.value = []
      error.value  = ''
      totalResults.value = 0
      return
    }

    loading.value = true
    error.value   = ''

    try {
      // Build URL — only append type param if not 'all'
      const params = new URLSearchParams({
        s:      query.trim(),
        page:   String(page),
        apikey: API_KEY,
      })
      if (type && type !== 'all') params.set('type', type)

      const res  = await fetch(`${BASE_URL}?${params}`)
      if (!res.ok) throw new Error(`Network error: ${res.status}`)

      const data = await res.json()

      if (data.Response === 'True') {
        movies.value       = data.Search
        totalResults.value = parseInt(data.totalResults, 10) || 0
      } else {
        movies.value       = []
        totalResults.value = 0
        error.value        = data.Error || 'No results found.'
      }
    } catch (err) {
      movies.value       = []
      totalResults.value = 0
      error.value        = 'Failed to connect. Please check your API key and network.'
      console.error('[useMovieSearch]', err)
    } finally {
      loading.value = false
    }
  }

  return {
    movies,
    loading,
    error,
    totalResults,
    totalPages,
    searchMovies,
  }
}