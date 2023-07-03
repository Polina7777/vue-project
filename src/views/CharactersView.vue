<script setup lang="ts">
import CharactersList from "../components/CharactersList.vue"

const props = defineProps({
    auth:Object
  })
//   console.log(props)
// export default {
//   props: ['auth'],
//   data () {
//     return {

//     }
//   },

//   methods: {
//     submit () {
//     return this.submitFilters({
//         name: this.name,
//         status: this.status,
//        gender: this.gender,
//       })
//     }
//   }
// }
</script>

<template>
    {{ auth  }}
<CharactersList  />
</template>

<style>

</style>
