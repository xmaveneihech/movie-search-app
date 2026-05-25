<script setup>
import { computed } from 'vue'

// ── Props & Emits ─────────────────────────────────────────────────────────
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages:  { type: Number, required: true },
})
const emit = defineEmits(['change'])

const isFirst = computed(() => props.currentPage <= 1)
const isLast  = computed(() => props.currentPage >= props.totalPages)

function prev() { if (!isFirst.value) emit('change', props.currentPage - 1) }
function next() { if (!isLast.value)  emit('change', props.currentPage + 1) }
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="pagination"
    aria-label="Search results pagination"
  >
    <button
      class="pag-btn pag-btn--prev"
      :disabled="isFirst"
      aria-label="Previous page"
      @click="prev"
    >
      <span aria-hidden="true">←</span> Prev
    </button>

    <span class="pag-info">
      <strong>{{ currentPage }}</strong>
      <span class="pag-info__sep">/</span>
      <span class="pag-info__total">{{ totalPages }}</span>
    </span>

    <button
      class="pag-btn pag-btn--next"
      :disabled="isLast"
      aria-label="Next page"
      @click="next"
    >
      Next <span aria-hidden="true">→</span>
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  animation: fadeIn 0.3s ease;
}

.pag-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--bg-2);
  border: 1px solid var(--border);
  color: var(--text-2);
  font-family: var(--font-ui);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 0.55rem 1.2rem;
  border-radius: var(--r-sm);
  transition: border-color var(--t-fast), color var(--t-fast), background var(--t-fast), transform var(--t-fast);
  min-width: 90px;
  justify-content: center;
}

.pag-btn:hover:not(:disabled) {
  border-color: var(--border-hover);
  color: var(--accent);
  background: var(--accent-pale);
  transform: translateY(-1px);
}

.pag-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.pag-info {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-2);
  min-width: 70px;
  text-align: center;
}

.pag-info strong { color: var(--accent); }
.pag-info__sep   { margin: 0 0.2rem; color: var(--text-3); }
.pag-info__total { color: var(--text-3); }

@media (max-width: 400px) {
  .pag-btn { padding: 0.5rem 0.8rem; min-width: 72px; font-size: 0.8rem; }
}
</style>