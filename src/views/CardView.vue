<script setup lang="ts">
import route from 'vue-router'

import { defineAsyncComponent } from 'vue'

const CardComponent = defineAsyncComponent(() =>
  import("../components/Card.vue")
)
</script>


  <template>
    <h1>The user is {{ $route.params.name }}</h1>
    <h1>This is a card page</h1>
      <span>
          Looking for Product: {{ this.$route.params.id }}
      </span>
      <CardComponent/>
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