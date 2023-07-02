<script lang="ts" setup>
import { ref } from 'vue'

const name = ref('')

const status = ref('')
const gender = ref('')

</script>

<template>
    <div class="filters_wrapper">
   <div class="name_input">
  <h2>Name</h2>
  <input v-model="name"> {{ name }}
</div>
<div class="status_input">
  <h2>Status</h2>
  <input type="radio" id="alive" value="alive" v-model="status">
  <label for="alive">Alive</label>
  <br>
  <input type="radio" id="dead" value="dead" v-model="status">
  <label for="dead">Dead</label>
  <br>
  <input type="radio" id="unknow" value="unknow" v-model="status">
  <label for="unknow">Unknow</label>
  <br>
  <span>Picked: {{ status }}</span>
</div>
<div class="gender_input">
  <h2>Gender</h2>
  <input type="radio" id="female" value="female" v-model="gender">
  <label for="female">Female</label>
  <br>
  <input type="radio" id="male" value="male" v-model="gender">
  <label for="male">Male</label>
  <br>
  <input type="radio" id="genderless" value="genderless" v-model="gender">
  <label for="genderless">Genderless</label>
  <input type="radio" id="unknow" value="unknow" v-model="gender">
  <label for="unknow">Unknow</label>
  <br>
  <span>Picked: {{ gender }}</span>
</div>
</div>
</template>

<style scoped>
.filters_wrapper {
    display: flex;
    align-items: center;
    flex-direction:column;
    justify-content:center;
    align-content: center;
    width:400px;
    padding:20px;
    border:3px solid rgb(199, 199, 232);
    background-color: rgb(156, 140, 170);
    border-radius:10px;
    margin:10px;
    color:rgba(0, 0, 255, 0.129);
}

  </style>