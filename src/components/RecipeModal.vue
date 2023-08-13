<script lang="ts" setup>
import AddRecipeForm from './addRecipeForm.vue'
const props = defineProps({
  showRecipeModal: Boolean
})
</script>
<template>
  <Transition name="modal">
    <div v-if="showRecipeModal" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <button class="modal-default-button" @click="$emit('close')">Close</button>
          <slot name="header"></slot>
        </div>
        <div class="modal-body">
          <slot name="body">
            <AddRecipeForm />
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
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  width: 85%;
  min-width: 300px;
  margin: 30px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  border: 2px solid rgb(199, 199, 232);
  background-color: var(--background-general);
  border-radius: 10px;
  color: rgba(0, 0, 255, 0.129);
  overflow: scroll;
}
.modal-default-button {
  padding: 5px 8px;
  border: 2px solid rgb(199, 199, 232);
  background-color: var(--background-general);
  border-radius: 10px;
  color: rgb(240, 240, 245);
  font-size: 0.8rem;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  -webkit-transform: scale(0.8);
  transform: scale(0.8);
}
@media (max-width: 500px) {
  .modal-container {
    padding: 10px;
    gap: 7px;
  }
  .modal-default-button {
    font-size: 0.7rem;
  }
}
</style>
