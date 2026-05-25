<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMovieSearch } from '@/composables/useMovieSearch.js'
import SearchBar from '@/components/SearchBar.vue'
import FilterBar from '@/components/FilterBar.vue'
import MovieGrid from '@/components/MovieGrid.vue'
import Pagination from '@/components/Pagination.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import StateMessage from '@/components/StateMessage.vue'

// ── Props from router (synced with URL query params) ──────────────────────
const props = defineProps({
  q:    { type: String,  default: '' },
  page: { type: Number,  default: 1 },
  type: { type: String,  default: 'all' },
})

const router = useRouter()
const route  = useRoute()

// ── Local reactive state (mirrors URL) ───────────────────────────────────
const query      = ref(props.q)
const currentPage = ref(props.page)
const activeType  = ref(props.type)

// ── Search composable ────────────────────────────────────────────────────
const { movies, loading, error, totalResults, totalPages, searchMovies } = useMovieSearch()

// ── Debounce timer ───────────────────────────────────────────────────────
let debounceTimer = null

/**
 * Push updated query params to the URL and trigger search.
 * Centralised so all param changes go through one place.
 */
function pushAndSearch(newQuery, newPage, newType) {
  const queryParams = {}
  if (newQuery) queryParams.q    = newQuery
  if (newPage !== 1) queryParams.page = newPage
  if (newType !== 'all') queryParams.type = newType

  router.push({ name: 'home', query: queryParams })
  searchMovies(newQuery, newPage, newType)
}

// ── Handlers ─────────────────────────────────────────────────────────────

/** Called by SearchBar on input — debounced 500ms */
function onQueryInput(val) {
  query.value = val
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    pushAndSearch(val, 1, activeType.value)
  }, 500)
}

/** Called by SearchBar on explicit submit (Enter / button) */
function onSearchSubmit(val) {
  clearTimeout(debounceTimer)
  query.value = val
  currentPage.value = 1
  pushAndSearch(val, 1, activeType.value)
}

/** Called by FilterBar */
function onTypeChange(type) {
  activeType.value  = type
  currentPage.value = 1
  pushAndSearch(query.value, 1, type)
}

/** Called by Pagination */
function onPageChange(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  pushAndSearch(query.value, page, activeType.value)
}

// ── Sync state if user navigates via browser back/forward ─────────────────
watch(
  () => route.query,
  (q) => {
    query.value       = q.q    || ''
    currentPage.value = Number(q.page) || 1
    activeType.value  = q.type || 'all'
    // Re-run search when URL changes externally
    if (q.q) searchMovies(q.q, Number(q.page) || 1, q.type || 'all')
    else {
      movies.value = []
    }
  }
)

// ── Run initial search if URL already has a query (e.g. shared link) ──────
onMounted(() => {
  if (props.q) searchMovies(props.q, props.page, props.type)
})

// ── Computed display state ────────────────────────────────────────────────
const showIdle    = computed(() => !query.value && !loading.value)
const showResults = computed(() => !loading.value && !error.value && movies.value.length > 0)
const showEmpty   = computed(() => !loading.value && !!error.value)
</script>

<template>
  <main class="home">
    <!-- ── Hero / Search section ── -->
    <section class="hero">
      <div class="hero__text">
        <h2 class="hero__title">
          Find any film,<br/>
          <em>instantly.</em>
        </h2>
        <p class="hero__sub">Search across millions of movies and series</p>
      </div>

      <SearchBar
        :model-value="query"
        @update:model-value="onQueryInput"
        @submit="onSearchSubmit"
      />

      <!-- Filter row below search -->
      <FilterBar :active-type="activeType" @change="onTypeChange" />
    </section>

    <!-- ── Results area ── -->
    <section class="results">
      <!-- Loading -->
      <LoadingSpinner v-if="loading" />

      <!-- Idle (no search yet) -->
      <StateMessage
        v-else-if="showIdle"
        icon="◈"
        message="Enter a title to begin searching"
        sub="Movies, series, episodes — all in one place"
      />

      <!-- Error / no results -->
      <StateMessage
        v-else-if="showEmpty"
        icon="○"
        :message="error"
        sub="Try a different title or remove the type filter"
        is-error
      />

      <!-- Results grid + pagination -->
      <template v-else-if="showResults">
        <div class="results__meta">
          <span class="results__count">
            <strong>{{ totalResults.toLocaleString() }}</strong>
            result{{ totalResults !== 1 ? 's' : '' }} for
            <em>"{{ query }}"</em>
            <span v-if="activeType !== 'all'" class="results__type-tag">{{ activeType }}</span>
          </span>
          <span class="results__page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        </div>

        <MovieGrid :movies="movies" />

        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="onPageChange"
        />
      </template>
    </section>
  </main>
</template>

<style scoped>
.home {
  flex: 1;
}

/* ── Hero ─────────────────────────────────── */
.hero {
  padding: 3.5rem 2rem 2rem;
  max-width: 780px;
  margin: 0 auto;
  text-align: center;
}

.hero__title {
  font-family: var(--font-serif);
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--text-1);
  margin-bottom: 0.6rem;
  letter-spacing: -0.01em;
}

.hero__title em {
  font-style: italic;
  color: var(--accent);
}

.hero__sub {
  font-size: 0.9rem;
  color: var(--text-3);
  margin-bottom: 2rem;
  letter-spacing: 0.04em;
}

/* ── Results ─────────────────────────────── */
.results {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.results__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
  animation: fadeIn 0.3s ease;
}

.results__count {
  font-size: 0.88rem;
  color: var(--text-2);
}

.results__count strong { color: var(--text-1); font-weight: 600; }
.results__count em     { font-style: italic; color: var(--text-1); }

.results__type-tag {
  display: inline-block;
  margin-left: 0.4rem;
  padding: 0.1rem 0.5rem;
  background: var(--accent-pale);
  color: var(--accent);
  border-radius: var(--r-sm);
  font-size: 0.75rem;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.results__page-info {
  font-size: 0.78rem;
  font-family: var(--font-mono);
  color: var(--text-3);
  letter-spacing: 0.06em;
}

@media (max-width: 600px) {
  .hero      { padding: 2rem 1.25rem 1.5rem; }
  .results   { padding: 0 1.25rem 3rem; }
  .results__meta { flex-direction: column; gap: 0.25rem; }
}
</style>