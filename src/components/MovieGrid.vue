<script setup>
import MovieCard from './MovieCard.vue'

defineProps({
  movies: { type: Array, required: true },
})
</script>

<template>
  <section class="movie-grid" aria-label="Movie results">
    <MovieCard
      v-for="(movie, i) in movies"
      :key="movie.imdbID"
      :movie="movie"
      :style="{ animationDelay: `${i * 45}ms` }"
      class="movie-grid__item"
    />
  </section>
</template>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
  gap: 1.5rem;
}

/* Staggered entrance */
.movie-grid__item {
  animation: fadeUp 0.45s var(--ease) both;
}

@media (max-width: 860px) {
  .movie-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1.1rem; }
}
@media (max-width: 520px) {
  .movie-grid { grid-template-columns: repeat(2, 1fr); gap: 0.85rem; }
}
</style>