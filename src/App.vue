<script lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import AuthModal from './components/AuthModal.vue';
import router from './router';
export default {
  data() {
    return {
    showAuthModal: ref(false),
    user: ref(null),
    isAuth:ref(false)
    };
  },
  methods: {
    submitAuth(data: any) {
      console.log('child component said login', data)
      this.showAuthModal=false;
      this.isAuth = true
      return this.user = data
    },
    signOut() {
      this.$router.push('/')
      this.isAuth = false
      return this.user = null;
    },
  },
  components: { AuthModal }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <div> -->
      <button class="auth" id="show-modal" @click="showAuthModal = true" v-if="!user"> Sign in </button>
      <button class="auth"  id="show-modal" @click="signOut" v-if="user"> Sign out </button>
    <Teleport to="body">
    <AuthModal :showAuthModal="showAuthModal" @close="showAuthModal = false" :submitAuth='submitAuth' >
      <template #header>
        <h3 class="title_modal"> Sign In</h3>
      </template>
    </AuthModal>
  </Teleport>
    </div>
  </header>
  <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="user"   to="/characters">Characters</RouterLink>
        <!-- <RouterLink v-if="user"  :to="{ name: 'characters', params : { user: this.user.name }}">Characters</RouterLink> -->
        <!-- <RouterLink v-if="user" :to="{ name: 'locations', params: { user: this.user.name}}">Locations</RouterLink> -->
        <RouterLink v-if="user"  to="/locations" >Locations</RouterLink>
      </nav>
  <RouterView />
  <RouterView name="users" />
</template>
<!-- // to="/locations" -->
<!-- to="/characters" -->
<!-- :to="{name : 'character' ,params : {id: item.id}}" -->
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
  font-size: 40px;
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
font-size: 21px;
margin: 10px;
}
@media (min-width: 1024px) {

  nav {
    text-align: center;
    font-size: 2rem;
  }
}
</style>
