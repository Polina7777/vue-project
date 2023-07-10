<script lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import AuthModal from './components/AuthModal.vue';
import RegisterModal from './components/RegisterModal.vue';

export default {

  data() {
    return {
    showAuthModal: ref(false),
    showRegModal: ref(false),
    isLoggedIn:ref(false),
    userData:ref()
    };
  },

beforeMount() {
this.authListener()
},
onMounted(){
   this.authListener()
   console.log(this.userData)
},

watch:{
  userData: async function checkIsLogged() {
    this.authListener()
   }
},
  methods: {
    userAuth(data: any) {
      this.showAuthModal=false;
      return this.userData=JSON.parse(data);
    },
    userReg(data: any) {
      this.showRegModal=false;
      return this.userData=data;
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
}
  
  },
  components: { AuthModal, RegisterModal }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <p v-if="userData" style="color: azure;">{{ userData.username }}</p>
      <button class="auth" id="show-modal" @click="showAuthModal = true" v-if="!isLoggedIn"> Sign in </button>
      <button class="auth"  id="show-modal" @click="showRegModal = true" v-if="!isLoggedIn"> Sign up </button>
      <button class="auth"  id="show-modal" @click="signOut" v-if="isLoggedIn"> Sign out </button>
    <Teleport to="body">
    <AuthModal :showAuthModal="showAuthModal" @close="showAuthModal = false"  :user="userAuth" >
      <!-- :submitAuth='submitAuth' -->
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
    </div>
  </header>
  <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/recipes">Recipes</RouterLink>
      </nav>
  <RouterView />
  <RouterView name="users" />
</template>

<style>
header {
  line-height: 1.5;
  background-color: var(--background-secondary);
  height: 100px;
  display: flex;
flex-direction: row;
justify-content: end;
align-items: center;
color: aliceblue;
}

nav {
  width: 100%;
  font-size: 1.5rem;
  text-align: center;
  justify-content: space-between;
  color:var(--text-secondary)
}

nav a.router-link-exact-active {
  color:var(--text-primary)
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
</style>
