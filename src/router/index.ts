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
      path: '/characters',
      name: 'characters',
      component: () => import('../views/CharactersView.vue'),
      props: true,
      meta:{
        isAuth:true,
        allowAnonymous: false
      }
    },
    {
      path: '/locations',
      name: 'locations',
      component: () => import('../views/LocationsView.vue'),
      props: true,
      meta:{
        isAuth:true,
        allowAnonymous: false
      }
    },
    
    { path: '/characters/:id', name: 'character' ,component: () => import('../views/CharacterView.vue')},
    { path: '/locations/:id', name: 'location' ,component: () => import('../views/LocationView.vue')},
  ]
})
// router.beforeEach((to,from,next)=>{
//   if(to.matched.some(record => record.meta.isAuth)){
//       let user = JSON.parse(localStorage.getItem('user'))
//       if(!user){
//           next('/')
//       }
//   }
//   next()
// })
export default router
