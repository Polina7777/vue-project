import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{
        isAuth:false,
        allowAnonymous: true
      }
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import('../views/CardsView.vue'),
      props: true,
      meta:{
        isAuth:true,
        allowAnonymous: false
      }
    },
    { path: '/recipes/:id', name: 'recipe' ,component: () => import('../views/CardView.vue')},
  ]
})
export default router
