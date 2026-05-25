<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <!-- Global site header -->
    <header class="site-header">
      <router-link to="/" class="site-logo">
        <span class="site-logo__mark">◈</span>
        <span class="site-logo__text">CINE<em>SEARCH</em></span>
      </router-link>
      <span class="site-header__powered">powered by OMDb</span>
    </header>

    <!-- Route views with page transition -->
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <footer class="site-footer">
      <span>Data from <a href="https://www.omdbapi.com" target="_blank" rel="noopener noreferrer">OMDb API</a></span>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Site Header ─────────────────────────── */
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 2rem;
  border-bottom: 1px solid var(--border);
  background: rgba(8, 11, 16, 0.85);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.site-logo {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-ui);
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: 0.1em;
  color: var(--text-1);
  transition: color var(--t-fast) var(--ease);
}

.site-logo:hover { color: var(--accent); }

.site-logo__mark {
  color: var(--accent);
  font-size: 1.3rem;
  line-height: 1;
  filter: drop-shadow(0 0 6px var(--accent-glow));
}

.site-logo__text em {
  font-style: normal;
  color: var(--accent);
}

.site-header__powered {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--text-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── Site Footer ─────────────────────────── */
.site-footer {
  margin-top: auto;
  padding: 1.25rem 2rem;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 0.78rem;
  color: var(--text-3);
}

.site-footer a {
  color: var(--accent-dim);
  transition: color var(--t-fast);
}
.site-footer a:hover { color: var(--accent); }

@media (max-width: 480px) {
  .site-header { padding: 1rem 1.25rem; }
  .site-header__powered { display: none; }
}
</style>