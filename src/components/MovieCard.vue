<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props  = defineProps({
  movie: { type: Object, required: true },
})
const router = useRouter()

const posterSrc = computed(() =>
  props.movie.Poster && props.movie.Poster !== 'N/A'
    ? props.movie.Poster
    : null
)

const TYPE_STYLE = {
  movie:   { label: 'Film',    cls: 'badge--film' },
  series:  { label: 'Series',  cls: 'badge--series' },
  episode: { label: 'Episode', cls: 'badge--episode' },
}

const typeMeta = computed(() =>
  TYPE_STYLE[props.movie.Type] || { label: props.movie.Type, cls: '' }
)

function navigate() {
  router.push({ name: 'movie-detail', params: { id: props.movie.imdbID } })
}
</script>

<template>
  <article
    class="card"
    role="button"
    tabindex="0"
    :aria-label="`View details for ${movie.Title}`"
    @click="navigate"
    @keydown.enter="navigate"
    @keydown.space.prevent="navigate"
  >
    <!-- Poster -->
    <div class="card__poster-wrap">
      <img
        v-if="posterSrc"
        :src="posterSrc"
        :alt="`${movie.Title} poster`"
        class="card__poster"
        loading="lazy"
      />
      <div v-else class="card__poster card__poster--ph">
        <span>🎞</span>
      </div>

      <!-- Type badge -->
      <span :class="['card__badge', typeMeta.cls]">{{ typeMeta.label }}</span>

      <!-- Hover overlay -->
      <div class="card__overlay">
        <span class="card__overlay-cta">View Details →</span>
      </div>
    </div>

    <!-- Info -->
    <div class="card__info">
      <h3 class="card__title" :title="movie.Title">{{ movie.Title }}</h3>
      <span class="card__year">{{ movie.Year }}</span>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform var(--t-med) var(--ease),
    box-shadow var(--t-med) var(--ease),
    border-color var(--t-med) var(--ease);
}

.card:hover,
.card:focus-visible {
  transform: translateY(-6px);
  box-shadow: var(--glow-card);
  border-color: rgba(0, 212, 200, 0.22);
  outline: none;
}

/* ── Poster ── */
.card__poster-wrap {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: var(--bg-2);
}

.card__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ease);
}

.card:hover .card__poster { transform: scale(1.07); }

.card__poster--ph {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  height: 100%;
  color: var(--text-3);
  background: linear-gradient(135deg, var(--bg-2), var(--bg-1));
}

/* ── Badge ── */
.card__badge {
  position: absolute;
  top: 0.55rem;
  left: 0.55rem;
  font-size: 0.6rem;
  font-family: var(--font-mono);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.18rem 0.5rem;
  border-radius: 4px;
  backdrop-filter: blur(8px);
  pointer-events: none;
}

.badge--film    { background: rgba(0, 212, 200, 0.85); color: #071515; }
.badge--series  { background: rgba(139, 92, 246, 0.85); color: #f0e8ff; }
.badge--episode { background: rgba(251, 191, 36, 0.85); color: #1a1000; }
.card__badge:not([class*="badge--"]) { background: rgba(255,255,255,0.15); color: var(--text-1); }

/* ── Hover overlay ── */
.card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 212, 200, 0.18) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  padding: 0.75rem;
  opacity: 0;
  transition: opacity var(--t-med) var(--ease);
}

.card:hover .card__overlay { opacity: 1; }

.card__overlay-cta {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--accent);
  letter-spacing: 0.06em;
}

/* ── Info ── */
.card__info {
  padding: 0.7rem 0.85rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.card__title {
  font-family: var(--font-ui);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-1);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__year {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--text-3);
}
</style>