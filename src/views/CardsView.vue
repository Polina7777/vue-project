<script setup lang="ts">
import CardList from "../components/CardList.vue"
import { defineAsyncComponent } from 'vue'

</script>


<template>
  <div class="about">
    <CardList/>
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
