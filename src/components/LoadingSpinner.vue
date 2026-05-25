<template>
  <div class="spinner-wrap" role="status" aria-live="polite" aria-label="Loading">
    <div class="spinner">
      <div class="spinner__track"></div>
      <div class="spinner__ring"></div>
      <div class="spinner__dot"></div>
    </div>
    <span class="spinner__label">Searching…</span>
  </div>
</template>

<style scoped>
.spinner-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 2rem;
  animation: fadeIn 0.25s ease;
}

.spinner {
  position: relative;
  width: 48px;
  height: 48px;
}

.spinner__track {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--bg-3);
}

.spinner__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--accent);
  border-right-color: rgba(0, 212, 200, 0.3);
  animation: spin 0.9s linear infinite;
}

.spinner__dot {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow);
  animation: pulse 1.4s ease-in-out infinite;
}

.spinner__label {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-3);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@keyframes spin  { to { transform: rotate(360deg); } }
</style>