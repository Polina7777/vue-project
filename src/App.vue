<script lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import AuthModal from './components/AuthModal.vue';
import RegisterModal from './components/RegisterModal.vue';
import type { IUser } from './interfaces';

export default {
  created() {

  if (localStorage.getItem('userData')) {
  const info = JSON.parse(localStorage.getItem('userData') as string)
  this.userName = info.username
  }
  },
  data() {
    return {
    showAuthModal: ref<boolean>(false),
    showRegModal: ref<boolean>(false),
    isLoggedIn:ref<boolean>(false),
    userData:ref(),
    userName:ref<string>()
    };
  },

beforeMount() {
this.authListener()
},
onMounted(){
   this.authListener()
},

watch:{
  userData: async function checkIsLogged() {
    this.authListener()
   }
},
  methods: {
    userAuth(data: any) {
      this.showAuthModal=false;
      this.userData = localStorage.getItem('userData')
      const info = JSON.parse(localStorage.getItem('userData') as string)
  this.userName = info.username
    },
    userReg(data: any) {
      this.showRegModal=false;
      this.userData = localStorage.getItem('userData')
      const info = JSON.parse(localStorage.getItem('userData') as string)
  this.userName = info.username
    },
    signOut() {
      this.$router.push('/')
      localStorage.removeItem('jwt');
      localStorage.removeItem('userData');
      return this.userData = null;
    },
    authListener(){
    const user = localStorage.getItem('jwt')
    if(!user){
       return this.isLoggedIn= false
    }else{
      return this.isLoggedIn = true
    }
},

  
  },
  components: { AuthModal, RegisterModal }
}
</script>

<template>
  <header>
      <div v-if="isLoggedIn" class="hello_wrapper">
      <p class="hello"> Hello, {{userName}} !</p>
      <img class="hello_image" src="https://www.svgrepo.com/show/402888/waving-hand.svg"/>
    </div>
    <div class="auth_wrapper">
      <button class="auth" id="show-modal" @click="showAuthModal = true" v-if="!isLoggedIn"> Sign in </button>
      <button class="auth"  id="show-modal" @click="showRegModal = true" v-if="!isLoggedIn"> Sign up </button>
    </div>
      <button class="auth"  id="show-modal" @click="signOut" v-if="isLoggedIn"> Sign out </button>
    <Teleport to="body">
    <AuthModal :showAuthModal="showAuthModal" @close="showAuthModal = false"  :user="userAuth" >
      <template #header>
        <h3 class="title_modal"> Sign In</h3>
      </template>
    </AuthModal>
  </Teleport>
  <Teleport to="body">
    <RegisterModal :showRegModal="showRegModal"  @close="showRegModal = false" :user="userReg" >
      <template #header>
        <h3 class="title_modal"> Sign Up</h3>
      </template>
    </RegisterModal>
  </Teleport>
  </header>
  <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/recipes">Recipes</RouterLink>
      </nav>
  <RouterView />
</template>

<style>
header {
  line-height: 1.5;
  background-color: var(--background-primary);
  border-bottom: 1px solid rgb(199, 199, 232);
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text-primary);
  justify-content: space-between;
}
.hello_image{
  width: 30px;
  height: 30px;
}
.hello{
  color: var(--text-primary);
  font-size: 30px;
  font-weight: 600;
}
.hello_wrapper{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
 align-items: center;
 padding: 10px 15px;
 gap:10px;
}
.auth_wrapper{
  display: flex;
flex-direction: row;
}
nav {
  width: 100%;
  font-size: 1.5rem;
  text-align: center;
  justify-content: space-between;
  color:var(--text-secondary)
}

nav a.router-link-exact-active {
  color:rgb(199, 199, 232)
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 10px;
}

nav a:first-of-type {
  border: 0;
}
.title_modal {
color: var(--text-primary)
}
.auth{
  padding: 10px 15px;
  transition: all 0.3s ease;
  border:2px solid rgb(199, 199, 232);
  background-color: var(--background-primary);
border-radius:10px;
color:rgba(230, 230, 246, 0.972);
font-size: 1rem;
margin: 10px;
}
@media (min-width: 1024px) {

  nav {
    text-align: center;
    font-size: 2rem;
  }
}
@media (max-width: 500px) {
.hello_wrapper{
  justify-content: center;
}
.hello{
  font-size: 1.3rem;
  flex-wrap: wrap;
}
.hello_image{
  width: 20px;
  height: 20px;
}
.auth{
  font-size: 1rem;
}
}
</style>
