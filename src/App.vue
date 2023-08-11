<script lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import AuthModal from './components/AuthModal.vue';
import RegisterModal from './components/RegisterModal.vue';
import MobileMenuModal from './components/MobileMenuModal.vue';
import Example from './components/Example.vue';



 export default {
  created() {
  const widthDevice = window.innerWidth;
  if(widthDevice < 700) {
   this.mobileVersion = true
  }
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
    showMobileModal:ref<boolean>(),
    userName:ref<string>(),
      height:window.innerHeight,
      width:window.innerWidth,
      mobileVersion:ref(false),
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
    userAuth() {
      this.showAuthModal=false;
      this.userData = localStorage.getItem('userData')
      const info = JSON.parse(localStorage.getItem('userData') as string)
  this.userName = info.username
    },
    userReg() {
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
openAuthForm (){
 this.showAuthModal = true

},
openRegForm (){
 this.showRegModal = true
},
 
  },
  components: { AuthModal, RegisterModal, MobileMenuModal, Example }
}
</script>

<template>
    <!-- <Example/> -->
  <header v-if="!mobileVersion">
      <div v-if="isLoggedIn" class="hello_wrapper">
      <p class="hello"> Hello, {{userName}} !</p>
      <img class="hello_image" src="https://www.svgrepo.com/show/402888/waving-hand.svg"/>
    </div>
    <div class="auth_wrapper">
      <button class="auth" id="show-modal" @click="showAuthModal = true" v-if="!isLoggedIn"> Sign in </button>
      <button class="auth"  id="show-modal" @click="showRegModal = true" v-if="!isLoggedIn"> Sign up </button>
      <!-- <button class="auth"  id="show-modal" @click="showMobileModal = true" >
        <img class="burger" src="https://www.svgrepo.com/show/395715/navigation-list-option-menu.svg"/>
      </button> -->
    </div>
      <button class="auth"  id="show-modal" @click="signOut" v-if="isLoggedIn"> Sign out </button>
      <Teleport to="body">
<!-- <MobileMenuModal :showMobileModal="showMobileModal" @close="showMobileModal = false"  :userName="userName" @showAuthModal="showAuthModal=true" @showRegModal="showRegModal=true" :isLoggedIn="isLoggedIn" :signOut="signOut">
  <template #header>
      </template>
</MobileMenuModal> -->
      </Teleport>
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
  <header v-if="mobileVersion">
    <div class="auth_wrapper">
      <button class="burger_button"  id="show-modal" @click="showMobileModal = true" >
        <img class="burger" src="https://www.svgrepo.com/show/395715/navigation-list-option-menu.svg"/>
      </button>
    </div>
      <Teleport to="body">
<!-- <MobileMenuModal :showMobileModal="showMobileModal" @close="showMobileModal = false"  :userName="userName" @showAuthModal="showAuthModal=true" @showRegModal="showRegModal=true" :isLoggedIn="isLoggedIn" :signOut="signOut" /> -->
<MobileMenuModal :showMobileModal="showMobileModal" @close="showMobileModal = false"  :userName="userName" :showAuthModal="openAuthForm" :showRegModal="openRegForm" :isLoggedIn="isLoggedIn" :signOut="signOut" />
</Teleport>

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
  <nav  v-if="!mobileVersion">
        <RouterLink class='router_link' to="/">Home</RouterLink>
        <RouterLink class='router_link' v-if="isLoggedIn" to="/recipes">Recipes</RouterLink>
      </nav>
  <RouterView />
  <footer>
    </footer>
     <Example/>
</template>

<style scoped>

header, footer {
  line-height: 1.5;
   background-color: rgb(45, 34, 66);
  border-top: 1px solid rgb(199, 199, 232);
  border-bottom: 1px solid rgb(199, 199, 232);
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text-primary);
  justify-content: space-between;
}
.router_link{
  z-index: 1000;
}
header {
  position: sticky;
  z-index: 200;
  top: 0;
}
footer{
  height: 50px;
}
.burger_button{
  background-color: transparent;
  border: none;
  padding: 5px 15px;
}
.hello_image, .burger{
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
  color:var(--text-secondary);
  z-index: 1000;

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
</style>
