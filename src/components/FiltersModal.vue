<script lang="ts" setup>
import { ref } from 'vue';
import FilterForm from './FilterForm.vue';
const name = ref('')
const status = ref('')
const gender = ref('')
const props = defineProps({
  showFilters: Boolean,

})

</script>

<template>
  <Transition name="filterMsodal">
    <div v-if="showFilters" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
            <button
              class="modal-default-button"
              @click="$emit('close')"
            >Close</button>
          <slot name="header">default header</slot>
        </div>

        <div class="modal-body">
            <slot name="body">
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
   </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 40%;
  min-height: 300px;
  min-width: 300px;
  height: 80%;
  overflow: scroll;
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  border:3px solid rgb(199, 199, 232);
background-color: rgb(126, 0, 237);
border-radius:10px;
color:rgba(0, 0, 255, 0.129);
/* margin: 100px; */
}

.modal-default-button{
    padding:7px 10px;
    border:3px solid rgb(199, 199, 232);
    background-color: rgb(132, 0, 255);
    border-radius:10px;
    color:rgb(224, 224, 243);
    font-size: 20px;
  }
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.episode, .title {
list-style-type: none;
text-decoration: none;
font-size: 18px;
padding: 10px;
}
</style>