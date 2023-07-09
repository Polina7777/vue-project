<script setup lang="ts">
import CharactersList from "../components/CharactersList.vue"
import { useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted } from 'vue'
const router = useRouter()

const authListener=()=>{
    const user = localStorage.getItem('jwt')
    if(!user){
         router.push('/')
    }
}
onBeforeUnmount(()=>{
    authListener()
})
onMounted(()=>{
    authListener()
})

</script>

<template>
<CharactersList  />
</template>

<style>

</style>
