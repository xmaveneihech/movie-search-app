<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieDetail } from '@/composables/useMovieDetail.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import StateMessage from '@/components/StateMessage.vue'

// ── Props ─────────────────────────────────────────────────────────────────
const props  = defineProps({ id: { type: String, required: true } })
const router = useRouter()

const { movie, loading, error, fetchMovie } = useMovieDetail()

onMounted(() => fetchMovie(props.id))

// ── Helpers ───────────────────────────────────────────────────────────────

const posterSrc = computed(() =>
  movie.value?.Poster && movie.value.Poster !== 'N/A'
    ? movie.value.Poster
    : null
)

/** IMDb rating → width for the progress bar (max 10) */
const ratingPct = computed(() => {
  const r = parseFloat(movie.value?.imdbRating)
  return isNaN(r) ? 0 : (r / 10) * 100
})

/** Rating colour: green ≥ 7, yellow ≥ 5, red < 5 */
const ratingColor = computed(() => {
  const r = parseFloat(movie.value?.imdbRating)
  if (isNaN(r)) return 'var(--text-3)'
  if (r >= 7)   return '#4ade80'
  if (r >= 5)   return '#fbbf24'
  return '#f87171'
})

/** Split comma-separated values into arrays for pills */
const genres  = computed(() => splitField(movie.value?.Genre))
const actors  = computed(() => splitField(movie.value?.Actors))

function splitField(val) {
  if (!val || val === 'N/A') return []
  return val.split(',').map((s) => s.trim()).filter(Boolean)
}

function goBack() {
  if (window.history.length > 2) router.back()
  else router.push({ name: 'home' })
}
</script>

<template>
  <main class="detail-page">
    <!-- Loading -->
    <LoadingSpinner v-if="loading" />

    <!-- Error -->
    <StateMessage
      v-else-if="error"
      icon="○"
      :message="error"
      sub="The movie could not be found"
      is-error
    />

    <!-- Movie detail -->
    <article v-else-if="movie" class="detail">
      <!-- Back button -->
      <button class="back-btn" @click="goBack">
        <span class="back-btn__arrow">←</span> Back to Search
      </button>

      <!-- ── Layout: poster + info ── -->
      <div class="detail__layout">
        <!-- Poster column -->
        <div class="detail__poster-col">
          <div class="detail__poster-wrap">
            <img
              v-if="posterSrc"
              :src="posterSrc"
              :alt="`${movie.Title} poster`"
              class="detail__poster"
            />
            <div v-else class="detail__poster detail__poster--placeholder">
              <span>🎞</span>
              <span>No Poster</span>
            </div>
          </div>

          <!-- IMDb rating pill below poster on desktop -->
          <div class="detail__rating-block" v-if="movie.imdbRating && movie.imdbRating !== 'N/A'">
            <span class="detail__rating-label">IMDb Rating</span>
            <div class="detail__rating-row">
              <span class="detail__rating-score" :style="{ color: ratingColor }">
                {{ movie.imdbRating }}
              </span>
              <span class="detail__rating-max">/10</span>
            </div>
            <div class="detail__rating-bar">
              <div
                class="detail__rating-fill"
                :style="{ width: ratingPct + '%', background: ratingColor }"
              ></div>
            </div>
            <span v-if="movie.imdbVotes && movie.imdbVotes !== 'N/A'" class="detail__rating-votes">
              {{ movie.imdbVotes }} votes
            </span>
          </div>
        </div>

        <!-- Info column -->
        <div class="detail__info">
          <!-- Type badge + year -->
          <div class="detail__eyebrow">
            <span v-if="movie.Type" class="detail__type-badge">{{ movie.Type }}</span>
            <span class="detail__year">{{ movie.Year }}</span>
            <span v-if="movie.Runtime && movie.Runtime !== 'N/A'" class="detail__runtime">
              {{ movie.Runtime }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="detail__title">{{ movie.Title }}</h1>

          <!-- Genre pills -->
          <div v-if="genres.length" class="detail__pills">
            <span v-for="g in genres" :key="g" class="pill">{{ g }}</span>
          </div>

          <!-- Metadata grid -->
          <dl class="detail__meta">
            <template v-if="movie.Director && movie.Director !== 'N/A'">
              <dt>Director</dt>
              <dd>{{ movie.Director }}</dd>
            </template>
            <template v-if="movie.Language && movie.Language !== 'N/A'">
              <dt>Language</dt>
              <dd>{{ movie.Language }}</dd>
            </template>
            <template v-if="movie.Country && movie.Country !== 'N/A'">
              <dt>Country</dt>
              <dd>{{ movie.Country }}</dd>
            </template>
            <template v-if="movie.Rated && movie.Rated !== 'N/A'">
              <dt>Rated</dt>
              <dd>{{ movie.Rated }}</dd>
            </template>
          </dl>

          <!-- Actors -->
          <div v-if="actors.length" class="detail__section">
            <h3 class="detail__section-title">Cast</h3>
            <div class="detail__pills detail__pills--cast">
              <span v-for="a in actors" :key="a" class="pill pill--ghost">{{ a }}</span>
            </div>
          </div>

          <!-- Plot -->
          <div v-if="movie.Plot && movie.Plot !== 'N/A'" class="detail__section">
            <h3 class="detail__section-title">Plot</h3>
            <p class="detail__plot">{{ movie.Plot }}</p>
          </div>

          <!-- Awards -->
          <div v-if="movie.Awards && movie.Awards !== 'N/A'" class="detail__awards">
            <span class="detail__awards-icon">◆</span>
            {{ movie.Awards }}
          </div>
        </div>
      </div>
    </article>
  </main>
</template>

<style scoped>
.detail-page {
  flex: 1;
  padding: 2rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  animation: fadeUp 0.4s var(--ease) both;
}

/* ── Back button ──────────────────────────── */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-2);
  font-family: var(--font-ui);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 0.5rem 1rem;
  border-radius: var(--r-sm);
  margin-bottom: 2.5rem;
  transition: border-color var(--t-fast), color var(--t-fast), background var(--t-fast);
}

.back-btn:hover {
  border-color: var(--border-hover);
  color: var(--accent);
  background: var(--accent-pale);
}

.back-btn__arrow {
  font-size: 1.1rem;
  line-height: 1;
}

/* ── Layout ──────────────────────────────── */
.detail__layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  align-items: start;
}

/* ── Poster ──────────────────────────────── */
.detail__poster-wrap {
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  aspect-ratio: 2/3;
}

.detail__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail__poster--placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: var(--bg-2);
  color: var(--text-3);
  font-size: 0.8rem;
  height: 100%;
  min-height: 280px;
}
.detail__poster--placeholder span:first-child {
  font-size: 3rem;
  filter: grayscale(1) opacity(0.35);
}

/* ── Rating ──────────────────────────────── */
.detail__rating-block {
  margin-top: 1.25rem;
  padding: 1rem;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
}

.detail__rating-label {
  display: block;
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--text-3);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.detail__rating-row {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
}

.detail__rating-score {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  line-height: 1;
  font-weight: 400;
}

.detail__rating-max {
  font-size: 1rem;
  color: var(--text-3);
}

.detail__rating-bar {
  height: 4px;
  background: var(--bg-3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.detail__rating-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s var(--ease);
}

.detail__rating-votes {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--text-3);
}

/* ── Info column ─────────────────────────── */
.detail__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.detail__type-badge {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.2rem 0.6rem;
  border-radius: var(--r-sm);
  background: var(--accent-pale);
  color: var(--accent);
  border: 1px solid rgba(0, 212, 200, 0.2);
}

.detail__year,
.detail__runtime {
  font-size: 0.85rem;
  color: var(--text-3);
  font-family: var(--font-mono);
}

.detail__year::before { content: ''; }

.detail__title {
  font-family: var(--font-serif);
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--text-1);
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
}

/* ── Pills ───────────────────────────────── */
.detail__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.pill {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  padding: 0.25rem 0.7rem;
  border-radius: var(--r-sm);
  background: var(--bg-3);
  color: var(--text-2);
  border: 1px solid var(--border);
  letter-spacing: 0.04em;
}

.pill--ghost {
  background: transparent;
  color: var(--text-2);
}

/* ── Metadata DL ─────────────────────────── */
.detail__meta {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.4rem 1rem;
  font-size: 0.86rem;
  margin-bottom: 1.75rem;
  padding: 1rem 1.25rem;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
}

.detail__meta dt {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-3);
  padding-top: 0.1rem;
}

.detail__meta dd {
  color: var(--text-1);
}

/* ── Sections ────────────────────────────── */
.detail__section {
  margin-bottom: 1.5rem;
}

.detail__section-title {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-3);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.detail__plot {
  font-size: 0.95rem;
  color: var(--text-2);
  line-height: 1.75;
  font-family: var(--font-serif);
  font-style: italic;
}

/* ── Awards ──────────────────────────────── */
.detail__awards {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--text-2);
  padding: 0.6rem 1rem;
  background: rgba(251, 191, 36, 0.07);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: var(--r-md);
  margin-top: 0.5rem;
}

.detail__awards-icon {
  color: #fbbf24;
  font-size: 0.7rem;
}

/* ── Responsive ──────────────────────────── */
@media (max-width: 860px) {
  .detail__layout {
    grid-template-columns: 220px 1fr;
    gap: 2rem;
  }
}

@media (max-width: 640px) {
  .detail-page { padding: 1.5rem 1.25rem 3rem; }

  .detail__layout {
    grid-template-columns: 1fr;
  }

  .detail__poster-wrap {
    max-width: 260px;
    margin: 0 auto;
  }

  .detail__rating-block {
    max-width: 260px;
    margin: 1rem auto 0;
  }
}
</style>