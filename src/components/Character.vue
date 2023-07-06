<script lang="ts">
  import { recipesApi } from '@/api-requests/recipes-api';
  import { processApi } from '@/api-requests/process-api';
  import {ingredientsApi} from '../api-requests/ingredients-api';
  import { userApi } from '../api-requests/user-api.ts'
import { favoritesApi } from '../api-requests/favorites-api'
import Modal from './Modal.vue';

import { ref } from 'vue'
export default {
    // async mounted() {
    //     this.getCard(this.$route.params.id);
    // },
    created() {
  this.getCard(this.$route.params.id)
  },
    data() {
        return {
          // id: this.cardId,
            info: null,
            showModal: ref(false),
            process:ref(),
            ingredients:ref(),
            likeClicked:ref(false),
      checkComplite:ref(false),
      check:ref(false),
      userData:ref(),
      favoritesList:ref(),
  
        };
    },
    methods: {
      async  getCard(id: string) {
            // fetch("https://rickandmortyapi.com/api/character/" + id)
            //     .then(response => response.json())
            //     .then(data => {
            //       this.episode = data.episode;
            //       (this.info = data)});
            this.info = await recipesApi.getRecipeByIdWithIngredientCollection(id)
            if(this.info){
           this.getProcess(this.info.attributes.processing.data.id)
           this.getIngredients(this.info.attributes.ingredient_collection.data.id)
        }
      },
        async getProcess(id:string){
          this.process = await processApi.getProcessByIdWithSteps(id)
        },
        async getIngredients(id:string){
          this.ingredients = await ingredientsApi.getIngredientCollectionByIdWithIngredients(id);
        },
       goBack(){
        this.$router.push('/characters')
       },

    async getUser(){
      this.userData = await userApi.getUsersById("1");
    },
    checkIsFavorite(recipe){
    const check = this.favoritesList?.find((item) => recipe.id === item.id);
      this.checkComplite=true
    // setCheckComplite(true);
    check ? this.likeClicked=true : this.likeClicked=false;
    return check;
  },
  likeClick(){
    
    if (!this.info) return;
    const checkResult = this.checkIsFavorite(this.info);
    if (checkResult) {
      this.deleteFavorite();
    } else {
     this.addNewFavorite();
    }
  },
  async getUsersFavoritesList() {
    if (this.userData && this.info) {
      try {
        const favorites = await favoritesApi.getFavorites(
          this.userData?.favorite.id
        );
        const check = favorites?.find((item) => this.info?.id === item.id);
        check ? this.likeClicked=true : this.likeClicked=false;
        this.favoritesList = favorites;
        this.checkComplite = true;
      } catch (err) {
        console.log(err);
      }
    }
  },
 async addNewFavorite(){
    if (this.userData) {
      try {
        const favorite = await favoritesApi.setFavorite(
         this.userData.favorite.id,
          this.info
        );
        this.likeClicked = true;
        this.getUsersFavoritesList();
      } catch (err) {
        console.log(err, "error");
      }
    }
  },
  async  deleteFavorite(){
    try {
      if (this.userData) {
        const favorite = await favoritesApi.deleteFavorite(
         this.userData.favorite.id,
          this.info
        );
      }
      this.likeClicked = false;
      this.getUsersFavoritesList();
    } catch (err) {
      console.log(err);
    }
  },
    },
    components: { Modal }
}
</script>

<template>
  <button class="back_button" @click="goBack">Go Back</button>
  <div class="card_wrapper">
<button @click="likeClick">
    <img class="like" v-if="!likeClicked" src="https://www.svgrepo.com/show/408364/heart-love-like-favorite.svg"/>
    <img class="like" v-if="likeClicked" src="https://www.svgrepo.com/show/422454/heart-love-romantic.svg"/>
  </button>
            
<div v-if="info" class="card">
  <h1 :title = info.attributes.title class="title">{{info.attributes.title}}</h1>
    <img :src="info.attributes.image_url" class="image"/>

    <div class="extra_info">
      <p :kcal = info.attributes.extra_info.data.attributes.kcal class="kcal">{{info.attributes.extra_info.data.attributes.kcal}} </p>
    <p :grams = info.attributes.extra_info.data.attributes.grams class="kcal">{{info.attributes.extra_info.data.attributes.grams}} </p>
    <p :min = info.attributes.extra_info.data.attributes.min class="kcal">{{info.attributes.extra_info.data.attributes.min}} </p>
    <p :serve = info.attributes.extra_info.data.attributes.serve class="kcal">{{info.attributes.extra_info.data.attributes.serve}} </p>
    </div>
    <!-- <h1 :title=info.name class="title"> {{info.name}}</h1> -->
    <!-- <img :src="info.image" class="image"/>
   <p :status=info.status  class="status"> Status: {{ info.status }}  </p>
   <p :species=info.species class="species">Species: {{ info.species }}  </p>
   <p  :gender="info.gender" class="gender"> Gender: {{ info.gender }}  </p>
   -->
   <button id="show-modal" @click="showModal = true">Show process  </button>
    <Teleport to="body">
    <Modal :show="showModal" @close="showModal = false" :process="process" :ingredients="ingredients" >
      <!-- <template #header>
        <h3 class="title_modal">Episodes with {{ info.name }}:</h3>
      </template> -->
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
  .back_button{
    padding:5px 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(135, 121, 148);
    border-radius:10px;
    color:rgb(224, 224, 243);
    /* font-size: 17px; */
    font-size: 1rem;
align-self: center;
  }
  .card_wrapper {
  padding: 40px;

  }
  .like{
    width: 20px;
    height:20px
  }
 .card {
    display: flex;
    align-items: center;
    flex-direction:column;
    align-items: center;
   /* min-width:400px; */
    padding:20px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(156, 140, 170);
    border-radius:10px;
    margin:10px;
    color:rgb(224, 224, 243);
  }
  .title{
    /* font-size:40px; */
    font-size: 1.5rem;
    padding: 10px;
  }
  .title_modal{
    color:rgb(229, 223, 234);;
    /* font-size: 25px; */
    font-size: 1.2rem;
    align-items: flex-end;
  }
  .status, .species, .gender{
    /* font-size:20px; */
    font-size: 1rem;
    padding: 10px;
  }
  #show-modal{
    padding:20px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(135, 121, 148);
    border-radius:10px;
    color:rgb(224, 224, 243);
    /* font-size: 20px; */
    font-size: 1rem;
  }
 
</style>