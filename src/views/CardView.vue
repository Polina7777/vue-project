<script setup lang="ts">
import BigCard from '../components/Bigcard.vue'
</script>



  <template>
  <BigCard :cardId=this.$route.params.id />
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