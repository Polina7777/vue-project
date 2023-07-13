
<script lang="ts">
import { ref} from "vue";
import FiltersModal from './FiltersModal.vue';
import Error from "./Error.vue";
import { categoryApi } from "@/api-requests/category-api";
import { filtersApi } from "@/api-requests/filters-api";
import { url_ngrok } from "@/api-requests";
import { favoritesApi } from "@/api-requests/favorites-api";
import { userApi } from "@/api-requests/user-api";
import { recipesApi } from "@/api-requests/recipes-api";
import type {IRecipe, ITag } from "@/interfaces";


  export default {
created() {
  this.getCards()
  this.getLikedRecipes()
  if (localStorage.getItem('userData')) {
  this.userInfo = JSON.parse(localStorage.getItem('userData') as string);
  }
  },

  data() {
    return {
      info:ref<any>(),
      userInfo: ref(),
      searchQuery: ref(""),
      categories:ref(),
      smallInfo:ref(),
      pageCount: ref(1),
      allPagesCount:ref(),
      showFiltersModal: ref(false),
      sortAsc:ref(false),
      filters: ref({
       kcal: null,
       serve: null,
       grams: null,
      }),
      error:ref(),
      tag:ref(),
      currentTag:ref(),
      loading:ref(),
      favFilter:ref(),
      errorText:ref('No result!'),
      favoritesList:ref(),
      likeClicked:ref(false),
      checkComplite:ref(false),
      userData:ref(),
      cardInfo:ref(),
      likesList:ref()
    };
  
  },
  watch: {
   pageCount: async function newPage() {
    console.log((Object.values(this.filters).filter(item=> item)).length)
    if(this.currentTag === null) {
      this.filterByFavorites()
    } else if((Object.values(this.filters).filter(item=> item)).length){
      this.getFilteredCardListByFiltersModal()
    }else {
      this.getCards()
    }
  
   },
   currentTag: async function filterTag(){
    this.favFilter=false
      this.filterByTag(this.currentTag?.id);
   },
   sortAsc: async function sort() {
     this.sortCardList()
   },
   favoritesList:async function checkFav(){
      this.checkIsFavorite(this.info)
   },
   userData: async function getFav() {
     this.getUsersFavoritesList()
   },
   likeClicked:async function(){
      this.getUsersFavoritesList()
      this.getLikedRecipes()
   },

},
  computed: {
    filteredData() {
    if(this.searchQuery && this.info){
      return this.info
      .filter(
        (item:IRecipe) => 
       { 
      return  item.attributes.title.toLowerCase().includes(this.searchQuery.toLowerCase())}
      );
    } else {
      return this.info
    }
  },
},
  methods: {
    async getCards() {
      this.error = false;
      this.loading = true;
    this.favFilter=false;
    this.userInfo = JSON.parse(localStorage.getItem('userData') as string)
    const user = await userApi.getUsersById(this.userInfo.id);
    this.userData = user
    this.getCategories();
    const sortType = this.sortAsc? 'asc': 'desc';
    try {
      const recipesData = await recipesApi.getAllRecipesWithIngredientCollection(sortType,this.pageCount)
      this.info = recipesData.data
      this.allPagesCount = recipesData.meta.pagination.pageCount
    } catch (err) {
      this.error = true;
    } finally {
      this.loading = false;
    }
    },
    async getCategories(){
      this.loading = true;
    this.error = false;
    try {
      this.categories = await categoryApi.getCategoriesOfRecipes()
    } catch (err) {
      this.error = true;
    } finally {
      this.loading = false;
    }
    },
    async filterByFavorites(){
      this.loading = true;
      this.favFilter=true;
      this.error = false;
      this.loading = true;
      // this.pageCount = 1
      this.currentTag = null
      const sortType = this.sortAsc? 'asc': 'desc';
    try {
      const user = await userApi.getUsersById(this.userInfo.id);
      const filteredList = await favoritesApi.getFavorites(user.favorite.id);
      const idArr = filteredList.map((item: any) => item.id);
      const resultArray = [];
      for (const item of idArr) {
        const response = await fetch(
          `${url_ngrok}api/foods/${item}?populate=*`
        );
        const result = await response.json();
        resultArray.push(result.data);
        this.likesList = resultArray
      }
        if(resultArray.length){
          this.allPagesCount =  Math.ceil(resultArray.length/3)
          if (this.pageCount > this.allPagesCount) {
            return this.pageCount = 1
          }
          let array = resultArray;
let size = 3; 
let subarray = [];
for (let i = 0; i <Math.ceil(array.length/size); i++){
   subarray[i] = array.slice((i*size), (i*size) + size);
}
   this.info = subarray[this.pageCount-1]
   return this.info
          // return  this.info = resultArray;
        }else{
          this.error=true
        }
    } catch (error) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  async getLikedRecipes(){

    try {
      const user = await userApi.getUsersById(this.userInfo.id);
      const filteredList = await favoritesApi.getFavorites(user.favorite.id);
      const idArr = filteredList.map((item: any) => item.id);
      const resultArray = [];
      for (const item of idArr) {
        const response = await fetch(
          `${url_ngrok}api/foods/${item}?populate=*`
        );
        const result = await response.json();
        resultArray.push(result.data);   
      }
     return  this.likesList = resultArray
    } catch (error) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  async checkLikeColor(){

  },
  async  getFilteredCardListByFiltersModal(){
    this.loading = true;
    this.error = false;
    const sortType = this.sortAsc? 'asc': 'desc';
    console.log(this.filters)
    try {
      const filteredCardList = await filtersApi.filtersByFiltersForm(this.filters,sortType,this.pageCount);
      if (filteredCardList.filteredData.length) {
      //   if (this.pageCount > this.allPagesCount) {
      //     this.filters ={
      //  kcal: "",
      //  serve: "",
      //  grams: "",
      // }
          //   return this.pageCount = 1
          // }
        this.allPagesCount = filteredCardList.pagination.pageCount
     return  this.info = filteredCardList.filteredData
      } else {
        this.error = true;
      }
      this.loading = false;
    } catch (err) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  async sortCardList(){
    this.loading = true;
    this.error = false;
    try {
let sortList;
  if(this.sortAsc){
    sortList = this.info?.sort(function (a:IRecipe, b:IRecipe) {
  if (a.attributes.title < b.attributes.title) {
    return -1;
  }
  if (a.attributes.title > a.attributes.title) {
    return 1;
  }
  return 0;
}
);
    return this.info = sortList
  }else{
  sortList = this.info?.sort(function (a:IRecipe, b:IRecipe) {
  if (b.attributes.title < a.attributes.title) {
    return -1;
  }
  if (a.attributes.title > a.attributes.title) {
    return 1;
  }
  return 0;
})
  return this.info = sortList
  }
    } catch (err) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  toggleSortType(){
    return this.sortAsc =!this.sortAsc
  },

    onClickLeftHandler(){
      if(this.pageCount <=1){
        return 1
      }
        return  this.pageCount--
    },
    onClickRightHandler(){
     if(this.pageCount === this.allPagesCount){
      return 1
     }
      return this.pageCount++
    },
    submitFilters (data: any) {
      this.showFiltersModal=false;
      this.filters = data
      this.getFilteredCardListByFiltersModal()
    },
    async filterByTag (tag: string){
      this.error = false
      this.error = false
      this.favFilter=false;
      this.loading = true;
      const sortType = this.sortAsc? 'asc': 'desc';
    try {
      const result = await filtersApi.filtersByTags(tag,sortType,this.pageCount)
     this.info = result.filteredData
     this.allPagesCount = result.pagination.pageCount
    } catch (err) {
      this.error = true
    } finally {
      this.loading = false;
    }
  },
 handleTagClick (item:ITag) {
    this.error = false
    this.pageCount=1
    this.favFilter=false;
    this.currentTag = item;
  },
  checkIsFavorite(recipe:IRecipe){
      const check = this.favoritesList?.find((item:IRecipe) => recipe.id === item.id);
      this.checkComplite=true
      check ? this.likeClicked=true : this.likeClicked=false;
      return check;
  },
  likeClick(item:IRecipe){
    if (!item) return;
    this.cardInfo = item
    const checkResult= this.likesList?.find((i:IRecipe) => item.id === i.id)
    if (checkResult) {
      this.deleteFavorite();
    } else {
     this.addNewFavorite();
    }
  },
  async addNewFavorite(){
    if (this.userData) {
      try {
        const favorite = await favoritesApi.setFavorite(
         this.userData.favorite.id,
          this.cardInfo
        );
        this.likeClicked = true;
        // this.getUsersFavoritesList();
        this.getLikedRecipes()
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
          this.cardInfo
        );
      }
      this.likeClicked = false;
      // this.getUsersFavoritesList();
      this.getLikedRecipes()
    } catch (err) {
    this.error=true
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
  },
  components: { FiltersModal,Error }
  }
</script>

<template>
  <div v-if="!error" class="card_list__wrapper">
    <div>
    <Teleport to="body">
    <FiltersModal :showFilters="showFiltersModal" @close="showFiltersModal = false" :submitFilters='submitFilters' >
      <template #header>
        <h3 class="title_modal"> Filters:</h3>
      </template>
    </FiltersModal>
  </Teleport>
</div>
    <div class="input_wrapper">
  <input  v-model="searchQuery">
</div>
<div class="page_info__wrapper" >
<p class="count">Page {{ pageCount }} from {{ allPagesCount }}</p>

</div>
  <ul class="tag_list">
    <button class="tag_button" @click="filterByFavorites">
    <h1 title="Favorites" class="tag_title">Favorites</h1>
    <img src='https://www.svgrepo.com/show/422454/heart-love-romantic.svg' class="tag_image"/>
  </button>
  <li class="tag"  v-for="(item) in categories">
    <button class="tag_button" @click="handleTagClick(item)">
    <h1 :title = item.attributes.name class="tag_title">{{item.attributes.name}}</h1>
    <img :src="item.attributes.image_url" class="tag_image"/>
  </button>
  </li>

</ul>
<div class="pagination_wrapper">
<button v-if="(pageCount !== 1 && !searchQuery.length)" class="arrow" @click="onClickLeftHandler"> &lt </button>
<div  class="card_list__wrapper"> 
  <div class="buttons_wrapper">
<button class="sort_button" @click="toggleSortType">
<img src='https://www.svgrepo.com/show/356266/sort-descending.svg' class="sort_image"/>
</button>
<button id="show-modal" @click="showFiltersModal = true"> Filters</button>
</div>
  <ul class="card_list">

  <li class="card"  v-for="(item) in filteredData">
    <button class="button_like" @click="()=>likeClick(item)">
      <img class="like" v-if="(likesList?.find((i:IRecipe) => item.id === i.id))" src="https://www.svgrepo.com/show/422454/heart-love-romantic.svg"/>
    <img class="like" v-if="!(likesList?.find((i:IRecipe) => item.id === i.id))" src="https://www.svgrepo.com/show/408364/heart-love-like-favorite.svg"/>
  </button>
<RouterLink :key="item.id" :to="{name : 'recipe' ,params : {id: item.id}}" :likeClicked="likeClicked" :checkComplite="checkComplite" :userData="userData" :favoritesList="favoritesList" :likeClick="likeClick">
    <h1 :title = item.attributes.title class="title">{{item.attributes.title}}</h1>
    <img :src="item.attributes.image_url" class="image"/>
    <div class="small_info">
    <p :kcal = item.attributes.small_extra_info.data.attributes.kcal class="kcal">{{item.attributes.small_extra_info.data.attributes.kcal}} </p>
    <p :grams = item.attributes.small_extra_info.data.attributes.grams class="kcal">{{item.attributes.small_extra_info.data.attributes.grams}} </p>
  </div>
    <h3 :description = item.attributes.description class="description">{{item.attributes.description}}</h3>
  
</RouterLink>
  </li>
</ul>

</div>

<button v-if="(pageCount !== allPagesCount && !searchQuery.length)" class="arrow" @click="onClickRightHandler"> > </button>
</div>
 </div>
 <div v-else="error" class="error_wrapper">
<Error :errorText='errorText'/>
<button class="error_button" @click="getCards">Try again</button>
</div>
</template>

<style scoped>
  .card_list__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    width: 100%;
  }
  .error_wrapper{
    display: flex;
flex-direction: column;
align-items: center;
  }
  .page_info__wrapper{
    display: flex;
flex-direction: column;
align-items: center;
  }
  .buttons_wrapper{
    display: flex;
    align-items: center;
  }
  .pagination_wrapper{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 80%;
  }
  .error_button{
    padding:10px 18px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:var(--text-secondary);
    font-size: 1rem;
  }
  .card_list {
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    justify-content: center;
    background-color: var(--background-general);
    width: 100%;
  }
  .image{
 width: 110px;
 height: 110px;
 border-radius: 50%;
 align-self: center;
 margin: 10px;
  }
  .tag_image{
 width: 30px;
 height: 30px;
 border-radius: 50%;
 align-self: center;
  }
.sort_image{
 align-self: center;
 width: 40px;
 height: 40px;
 border-radius: 50%;
  }
  .sort_button{
  background-color: transparent;
  border-color: transparent;
  }
  .tag {
    display: flex;
    flex-direction: row-reverse;
  }
  .tag_title{
    font-size: 1rem;
  }
  .button_like{
    align-self: end;
    background-color: transparent;
    border: transparent;
  }
  .like{
    width: 40px;
    height:40px
  }
  .tag_list {
   display: flex;
   flex-direction: row;
   flex-wrap: wrap;
   list-style: none;
   align-items: center;
   justify-content: center;
   gap:7px;
   padding: 20px;
  }
  .tag_button{
    display: flex;
    flex-direction: row-reverse;
    padding: 5px 9px;
    min-width: 120px;
    border-radius: 10px;
    border:1px solid var(--text-primary);
    background-color: var(--background-general);
    color:var(--text-primary);
    justify-content: center;
    align-items: center;
    gap:7px;

  }
.small_info{
display: flex;
gap:11px;
margin: 10px;
}
  input{
    padding: 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-secondary);
    border-radius:10px;
    font-size: 1rem;
    color:rgb(156, 140, 170);
    margin: 15px;
    outline:none;
  }
  .arrow{
    height: 50px;
    width: 50px;
    border-radius: 50%;
    font-size: 1rem;
    color: var(--background-general);
    background-color: rgb(230, 225, 234); 
  }
    .card {
    display: flex;
    align-items: center;
    flex-direction:column;
    width:290px;
    height: 405px;
    padding:20px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-secondary);
    border-radius:10px;
    margin:10px;
    color:rgba(0, 0, 255, 0.129);
  }
  #show-modal{
    padding:5px 10px;
    height: 35px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:rgb(224, 224, 243);
    font-size: 1rem;
  }
  .title{
    font-size: 1.2rem;
    text-align: center;
  }
  .description{
    font-size: 0.8rem;
    padding: 15px;
  }
.count{
    font-size: 1rem;
    padding: 10px;
    color:var(--text-secondary);
    font-weight: 600;
  }
  .title_modal{
    color:var(--text-secondary);;
    font-size: 1rem;
  }

  @media (max-width: 500px) {
.arrow{
  height: 30px;
    width: 30px;
}
/* .tag_list {
   display: flex;
    overflow-x: scroll;
   flex-wrap: nowrap;
  } */
  .card{
    padding: 10px;
  }
  .card_list__wrapper {
    padding: 10px;
  }
}
</style>