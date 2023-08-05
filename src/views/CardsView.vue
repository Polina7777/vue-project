<script setup lang="ts">
import CardList from "../components/CardList.vue"
import Animation from '@/components/2DAnimation.vue'
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
  <Animation/>
<CardList />
</template>

<style>

</style>
