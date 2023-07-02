<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/characters">Characters</RouterLink>
        <RouterLink to="/locations">Locations</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style>
header {
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  height: 150px;
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
  margin-top: 2rem;
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

@media (min-width: 1024px) {

  nav {
    text-align: center;
    font-size: 2rem;
  }
}
</style>
