<script lang="ts">
  import Modal from './Modal.vue';

import { ref } from 'vue'
export default {
    async mounted() {
        this.getCard(this.$route.params.id);
    },
    data() {
        return {
            id: this.cardId,
            info: { name: String, status: String, species: String, gender: String, image: String,episode:Array },
            showModal: ref(false),
            episode:[]
  
        };
    },
    methods: {
        getCard(id: string | string[]) {
            fetch("https://rickandmortyapi.com/api/character/" + id)
                .then(response => response.json())
                .then(data => {
                  this.episode = data.episode;
                  (this.info = data)});
        }

    },
    components: { Modal }
}
</script>

<template>
  <div class="card_wrapper">

<div class="card">
    <h1 :title=info.name class="title"> {{info.name}}</h1>
    <img :src="info.image" class="image"/>
   <p :status=info.status  class="status"> Status: {{ info.status }}  </p>
   <p :species=info.species class="species">Species: {{ info.species }}  </p>
   <p  :gender="info.gender" class="gender"> Gender: {{ info.gender }}  </p>
   <button id="show-modal" @click="showModal = true">Show episodes with {{ info.name }} </button>
    <Teleport to="body">
    <Modal :show="showModal" @close="showModal = false" :episode="episode">
      <template #header>
        <h3 class="title_modal">Episodes with {{ info.name }}:</h3>
      </template>
    </Modal>
  </Teleport>
    </div>
  </div>
</template>


<style scoped>
  .image{
 width:200px;
 height: 200px;
 border-radius: 100px;
 padding: 10px;
 align-self: center;
  }
  .card_wrapper {
  padding: 40px;

  }
 .card {
    display: flex;
    align-items: center;
    flex-direction:column;
    align-items: center;
   min-width:400px;
    padding:20px;
    border:3px solid rgb(199, 199, 232);
    background-color: rgb(156, 140, 170);
    border-radius:10px;
    margin:10px;
    color:rgb(224, 224, 243);
  }
  .title{
    font-size:40px;
    padding: 10px;
  }
  .title_modal{
    color:rgb(229, 223, 234);;
    font-size: 25px;
    align-items: flex-end;
  }
  .status, .species, .gender{
    font-size:20px;
    padding: 10px;
  }
  #show-modal{
    padding:20px;
    border:3px solid rgb(199, 199, 232);
    background-color: rgb(135, 121, 148);
    border-radius:10px;
    color:rgb(224, 224, 243);
    font-size: 20px;
  }
 
</style>