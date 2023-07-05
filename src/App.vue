<script lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import AuthModal from './components/AuthModal.vue';
import RegisterModal from './components/RegisterModal.vue';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
export default {

  data() {
    return {
    showAuthModal: ref(false),
    user: ref(null),
    showRegModal: ref(false),
    isLoggedIn:ref(false)
    };
  },
//  create() {
//     onAuthStateChanged(getAuth(),(user) => {
//     if (user) {
//     this.isLoggedIn = true // if we have a user
//     } else {
//       this.isLoggedIn = false // if we do not
//     } 
//   },
//   )},
  beforeMount() {
    onAuthStateChanged(getAuth(),(user) => {
    if (user) {
    this.isLoggedIn = true // if we have a user
    } else {
      this.isLoggedIn = false // if we do not
    } 
  },
)},
//   async mounted() {
//     onAuthStateChanged(getAuth(),(user) => {
//     if (user) {
//     this.isLoggedIn = true // if we have a user
//     } else {
//       this.isLoggedIn = false // if we do not
//     }
// })
//     },
  methods: {
    submitAuth(data: any) {
      this.showAuthModal=false;
      return this.user = data
    },
    submitReg(data: any) {
      this.showRegModal=false;
      return this.user = data
    },
    signOut() {
      this.$router.push('/')
      signOut(getAuth())
      return this.user = null;
    },
//     userStateChange(){
//       onAuthStateChanged(getAuth(),function(user) {
//     if (user) {
//       const isLoggedIn = true // if we have a user
//       return isLoggedIn
//     } else {
//       const isLoggedIn = false // if we do not
//       return isLoggedIn
//     }
// })
//      }
  
  },
  components: { AuthModal, RegisterModal }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <div> -->
      <button class="auth" id="show-modal" @click="showAuthModal = true" v-if="!isLoggedIn"> Sign in </button>
      <button class="auth"  id="show-modal" @click="showRegModal = true" v-if="!isLoggedIn"> Sign up </button>
      <button class="auth"  id="show-modal" @click="signOut" v-if="isLoggedIn"> Sign out </button>
    <Teleport to="body">
    <AuthModal :showAuthModal="showAuthModal" @close="showAuthModal = false" :submitAuth='submitAuth' >
      <template #header>
        <h3 class="title_modal"> Sign In</h3>
      </template>
    </AuthModal>
  </Teleport>
  <Teleport to="body">
    <RegisterModal :showRegModal="showRegModal" @close="showRegModal = false" :submitReg='submitReg'>
   
      <template #header>
        <h3 class="title_modal"> Sign Up</h3>
      </template>
    </RegisterModal>
  </Teleport>
    </div>
  </header>
  <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="isLoggedIn"  to="/characters">Characters</RouterLink>
        <RouterLink v-if="isLoggedIn"  to="/locations" >Locations</RouterLink>
      </nav>
  <RouterView />
  <RouterView name="users" />
</template>

<style>
header {
  line-height: 1.5;
  background-color: rgb(149, 138, 168);;
  height: 70px;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 1.5rem;
  text-align: center;
  justify-content: space-between;
  color:rgb(237, 237, 246);
}

nav a.router-link-exact-active {
  color:rgb(111, 68, 145);
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
.auth{
  padding: 10px 15px;
  transition: all 0.3s ease;
  border:2px solid rgb(199, 199, 232);
  background-color: rgb(114, 100, 126);
border-radius:10px;
color:rgba(230, 230, 246, 0.972);
/* font-size: 21px; */
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
