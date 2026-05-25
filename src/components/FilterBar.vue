<script setup>
// ── Props & Emits ─────────────────────────────────────────────────────────
defineProps({
  activeType: { type: String, default: 'all' },
})
const emit = defineEmits(['change'])

const FILTERS = [
  { value: 'all',    label: 'All' },
  { value: 'movie',  label: 'Movies' },
  { value: 'series', label: 'Series' },
]
</script>

<template>
  <div class="filter-bar" role="group" aria-label="Filter by type">
    <button
      v-for="f in FILTERS"
      :key="f.value"
      :class="['filter-btn', { 'filter-btn--active': activeType === f.value }]"
      @click="emit('change', f.value)"
    >
      {{ f.label }}
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.filter-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-3);
  font-family: var(--font-ui);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  transition: border-color var(--t-fast), color var(--t-fast), background var(--t-fast);
}

.filter-btn:hover {
  border-color: var(--border-hover);
  color: var(--text-1);
}

.filter-btn--active {
  background: var(--accent-pale);
  border-color: rgba(0, 212, 200, 0.4);
  color: var(--accent);
}
</style>