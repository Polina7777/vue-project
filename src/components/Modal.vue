<script lang="ts" setup>
const props = defineProps({
  show: Boolean,
  episode:Array
})

</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
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
          <!-- <slot name="body">default body</slot> -->
          <ul class="episodes_list">
  <li class="episode"  v-for="(item) in episode">
    <a class="title">{{item}}</a>
  </li>
   </ul>
   </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
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
background-color: rgb(156, 140, 170);
border-radius:10px;
color:rgba(0, 0, 255, 0.129);
}
.episodes_list{
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}
.modal-default-button{
    padding:7px 10px;
    border:3px solid rgb(199, 199, 232);
    background-color: rgb(135, 121, 148);
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

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

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