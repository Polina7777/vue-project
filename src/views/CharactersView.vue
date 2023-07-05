<script setup lang="ts">
import CharactersList from "../components/CharactersList.vue"
import { getAuth,onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { onBeforeUnmount } from 'vue'
const router = useRouter()
const authListener = onAuthStateChanged(getAuth(),function(user) {
    if (!user) { 
        alert('you must be logged in to view this. redirecting to the home page')
        router.push('/')
    }
});
onBeforeUnmount(() => {
    authListener()
})
</script>

<template>
<CharactersList  />
</template>

<style>

</style>
