import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MovieDetailView from '@/views/MovieDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // Preserve query params for search state
    props: (route) => ({
      q: route.query.q || '',
      page: Number(route.query.page) || 1,
      type: route.query.type || 'all',
    }),
  },
  {
    path: '/movie/:id',
    name: 'movie-detail',
    component: MovieDetailView,
    props: true,
  },
  {
    // Catch-all redirect to home
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll to top on every navigation
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router