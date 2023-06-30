import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/characters',
      name: 'characters',
      component: () => import('../views/CharactersView.vue')
    },
    {
      path: '/locations',
      name: 'locations',
      component: () => import('../views/LocationsView.vue')
    },
    
    { path: '/characters/:id', name: 'character' ,component: () => import('../views/CharacterView.vue')},
    { path: '/locations/:id', name: 'location' ,component: () => import('../views/LocationView.vue')},
  ]
})

export default router
