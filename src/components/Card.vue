<script lang="ts">
import { recipesApi } from '@/api-requests/recipes-api';
import { processApi } from '@/api-requests/process-api';
import {ingredientsApi} from '../api-requests/ingredients-api';
import { userApi } from '@/api-requests/user-api';
import { favoritesApi } from '../api-requests/favorites-api'
import Modal from './Modal.vue';
import { ref } from 'vue'
import type { IRecipe } from '@/interfaces';

export default {
    created() {
  this.getCard(this.$route.params.id as string)

  },
    data() {
      return {
      recipe:ref(),
      info: ref<IRecipe>(),
      showModal: ref(false),
      process:ref(),
      ingredients:ref(),
      likeClicked:ref(false),
      checkComplite:ref(false),
      check:ref(false),
      userData:ref(),
      userInfo:ref(),
      favoritesList:ref(),
      extraInfo:ref(),
      error:ref(),
        };
    },
    watch: {
   userData: async function getFav() {
     this.getUsersFavoritesList()
   },
   favoritesList:async function checkFav(){
    if(this.info){
    this.checkIsFavorite(this.info)}
   }
},
    methods: {
      async  getCard(id: string) {
        try {
      const recipeData = await recipesApi.getRecipeByIdWithIngredientCollection(id);
      const process = await processApi.getProcessByIdWithSteps(
        recipeData.attributes.processing.data.id
      );
      const ingredientsData =
        await ingredientsApi.getIngredientCollectionByIdWithIngredients(
          recipeData.attributes.ingredient_collection.data.id
        );
      const extraInfoArray = [
        recipeData.attributes.extra_info.data.attributes.min,
        recipeData.attributes.extra_info.data.attributes.grams,
        recipeData.attributes.extra_info.data.attributes.kcal,
        recipeData.attributes.extra_info.data.attributes.serve,
      ];
      this.userInfo = JSON.parse(localStorage.getItem('userData') as string)
  
      const user = await userApi.getUsersById(this.userInfo.id);

      this.ingredients = ingredientsData.attributes.ingredients.data
      this.extraInfo = extraInfoArray
      this.info = recipeData
      this.process = process.attributes.process_steps.data
      this.userData = user
    } catch (err) {
      this.error = true;
    }
      },
       goBack(){
        this.$router.push('/recipes')
       },
      checkIsFavorite(recipe:IRecipe){
      const check = this.favoritesList?.find((item:IRecipe) => recipe.id === item.id);
      this.checkComplite=true
      check ? this.likeClicked=true : this.likeClicked=false;
      return check;
  },
  likeClick(){
    console.log(this.info)
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
        const favorites = await favoritesApi.getFavorites(this.userData?.favorite.id);
        const check = favorites?.find((item:IRecipe) => this.info?.id === item.id);
        check ? this.likeClicked=true : this.likeClicked=false;
        this.favoritesList = favorites;
        this.checkComplite = true;
      } catch (err) {
        this.error=true
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
    this.error=true
    }
  },
    },
    components: { Modal }
}
</script>

<template>
  <button class="back_button" @click="goBack">Go Back</button>
  <div class="card_wrapper">
<div v-if="info" class="card">
  <button class="button_like" @click="likeClick">
    <img class="like" v-if="!likeClicked" src="https://www.svgrepo.com/show/408364/heart-love-like-favorite.svg"/>
    <img class="like" v-if="likeClicked" src="https://www.svgrepo.com/show/422454/heart-love-romantic.svg"/>
  </button>
  <h1 :title = info.attributes.title class="title">{{info.attributes.title}}</h1>
    <img :src="info.attributes.image_url" class="image"/>

    <div class="extra_info">
   <p :kcal = info.attributes.extra_info.data.attributes.kcal class="kcal">{{info.attributes.extra_info.data.attributes.kcal}} </p>
    <p :grams = info.attributes.extra_info.data.attributes.grams class="kcal">{{info.attributes.extra_info.data.attributes.grams}} </p>
    <p :min = info.attributes.extra_info.data.attributes.min class="kcal">{{info.attributes.extra_info.data.attributes.min}} </p>
    <p :serve = info.attributes.extra_info.data.attributes.serve class="kcal">{{info.attributes.extra_info.data.attributes.serve}} </p>
    </div>
   <button id="show-modal" @click="showModal = true">Show process</button>
    <Teleport to="body">
    <Modal :show="showModal" @close="showModal = false" :process="process" :ingredients="ingredients" />
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
  .extra_info{
    padding: 15px 15px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:15px;
    color:rgb(224, 224, 243);
    display: flex;
    flex-direction: row;
    gap:10px;
    margin-bottom: 10px;
  }
  .back_button{
    padding:5px 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:rgb(224, 224, 243);
    font-size: 1rem;
    align-self: center;
    margin-top: 20px;
    z-index: 1000;
  }
  .card_wrapper {
  padding: 40px;

  }
  .button_like{
    align-self: end;
    background-color: transparent;
    border: transparent;
    z-index: 1000;
  }
  .like{
    width: 40px;
    height:40px
  }
 .card {
    display: flex;
    align-items: center;
    flex-direction:column;
    align-items: center;
    padding:20px;
    max-height: 470px;
    width: 59%;
    min-width: 290px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-secondary);
    border-radius:10px;
    margin:10px;
    color:rgb(224, 224, 243);
  }
  .card_wrapper {
    display: flex;
    justify-content: center;
    margin: auto;
    width: 100vw;
    min-height: 75vh
  }
  .title{
    font-size: 1.5rem;
  }
  .title_modal{
    color:rgb(229, 223, 234);;
    font-size: 1.2rem;
    align-items: flex-end;
  }

  #show-modal{
    padding:20px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:rgb(224, 224, 243);
    font-size: 1rem;
    z-index: 1000;
  }
  .description{
    padding: 10px;
  }
  @media (max-width:650px) {  
  .card{
  width: 95vw;
}
}
  @media (max-width:540px) {  
  .image{
 width:150px;
 height: 150px;
 border-radius: 70px;
 padding: 10px;
 align-self: center;
  }
}
</style>