<script lang="ts" setup>
import FilterForm from './FilterForm.vue';

const props = defineProps({
  showFilters: Boolean,
  submitFilters:Function,
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
              <FilterForm :submitFilters='submitFilters'/>
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
  width: 440px;
  /* height: 420px;
  min-height: 420px; */
  height: 80dvh;
  margin: auto;
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  border:2px solid rgb(199, 199, 232);
  background-color: var(--background-general);
border-radius:10px;
color:rgba(0, 0, 255, 0.129);

}

.modal-default-button{
    padding:5px 8px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:rgb(240, 240, 245);
    font-size: 17px;
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

@media (max-width: 550px) {
  .modal-container {
    height: 380px;
    width: 270px;
  }
}
</style>