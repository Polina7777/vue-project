<script lang="ts" setup >
const props = defineProps({
  show: Boolean,
  process:Array,
  ingredients:Array,
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
          <slot name="header">
          </slot>
        </div>
        <div class="modal-body">
            <slot name="body">
            <ul class="ingredients_list">
  <li class="ingredient"  v-for="(item) in ingredients">
   <img class="ingredient_image" :src="item.attributes.image_url" />
  </li>
   </ul>
          <ul class="step_list">
  <li class="step"  v-for="(item) in process">
    <a class="name">{{item.attributes.name}}</a>
    <a class="description">{{item.attributes.description}}</a>
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
  width: 70%;
  min-height: 300px;
  min-width: 300px;
  height: 80%;
  /* overflow: scroll; */
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  border:2px solid rgb(199, 199, 232);
background-color: rgb(156, 140, 170);
border-radius:10px;
color:rgba(0, 0, 255, 0.129);
}
.step_list{
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}
.modal-default-button{
    padding:7px 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(135, 121, 148);
    border-radius:10px;
    color:rgb(224, 224, 243);
    font-size: 1rem;
  }
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 50px 0;
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
.description {
list-style-type: none;
text-decoration: none;
font-size: 1rem;
padding: 10px;
}
.step{
  list-style-type: none;
text-decoration: none;
font-size: 1.2rem;
font-weight: 600;
padding: 10px;
}
.ingredients_list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap:10px;
  list-style: none;
}
.ingredient_image{
  width: 30px;
  height: 30px;
 justify-content: "center";

}
.ingredient{
  padding:7px 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(135, 121, 148);
    border-radius:50%;
}
</style>