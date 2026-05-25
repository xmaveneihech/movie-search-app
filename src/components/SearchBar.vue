<script setup>
// ── Props & Emits ─────────────────────────────────────────────────────────
defineProps({
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'submit'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

function onKeydown(e) {
  if (e.key === 'Enter') emit('submit', e.target.value)
}

function onSubmit(e) {
  // Get current value from the input
  const input = e.currentTarget.previousElementSibling?.querySelector('input')
  emit('submit', input?.value || '')
}

function clear(inputEl) {
  emit('update:modelValue', '')
  emit('submit', '')
  // Focus after clearing
  inputEl?.focus()
}
</script>

<template>
  <div class="search-wrap">
    <div class="search-bar">
      <!-- Icon -->
      <span class="search-bar__icon" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>

      <!-- Input -->
      <input
        ref="inputEl"
        :value="modelValue"
        type="text"
        class="search-bar__input"
        placeholder="Search movies, series…"
        aria-label="Search movies"
        autocomplete="off"
        spellcheck="false"
        @input="onInput"
        @keydown="onKeydown"
      />

      <!-- Clear -->
      <button
        v-if="modelValue"
        class="search-bar__clear"
        aria-label="Clear"
        tabindex="-1"
        @click="() => emit('update:modelValue', '') || emit('submit', '')"
      >✕</button>

      <!-- Search button -->
      <button
        class="search-bar__btn"
        :disabled="!modelValue?.trim()"
        @click="() => emit('submit', modelValue)"
      >
        Search
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-wrap {
  margin-bottom: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 0.4rem 0.4rem 0.4rem 1rem;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
}

.search-bar:focus-within {
  border-color: var(--border-hover);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.search-bar__icon {
  color: var(--text-3);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.search-bar__input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: var(--font-ui);
  font-size: 1rem;
  color: var(--text-1);
  caret-color: var(--accent);
  min-width: 0;
}

.search-bar__input::placeholder { color: var(--text-3); }

.search-bar__clear {
  background: none;
  border: none;
  color: var(--text-3);
  font-size: 0.75rem;
  padding: 0.3rem;
  border-radius: var(--r-sm);
  transition: color var(--t-fast);
  flex-shrink: 0;
}
.search-bar__clear:hover { color: var(--text-1); }

.search-bar__btn {
  background: var(--accent);
  color: var(--text-inv);
  border: none;
  border-radius: var(--r-md);
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  padding: 0.65rem 1.4rem;
  flex-shrink: 0;
  transition: background var(--t-fast), transform var(--t-fast), opacity var(--t-fast);
}

.search-bar__btn:hover:not(:disabled) {
  background: #19ece0;
  transform: translateY(-1px);
}
.search-bar__btn:active:not(:disabled) { transform: translateY(0); }
.search-bar__btn:disabled { opacity: 0.3; cursor: not-allowed; }

@media (max-width: 480px) {
  .search-bar { border-radius: var(--r-md); padding: 0.35rem 0.35rem 0.35rem 0.8rem; }
  .search-bar__btn { padding: 0.6rem 1rem; font-size: 0.85rem; }
}
</style>