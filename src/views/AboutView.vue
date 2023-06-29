<script setup lang="ts">
import CardList from "../components/CardList.vue"
import { defineAsyncComponent } from 'vue'

const CardListComponent = defineAsyncComponent(() =>
  import("../components/CardList.vue")
)
</script>


<template>
  <div class="about">
    <h1>This is an about page</h1>
    <CardListComponent/>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
