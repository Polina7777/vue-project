
<script lang="ts">
import { ref} from "vue";
import FiltersModal from './FiltersModal.vue'
import Error from "./Error.vue";
import { categoryApi } from '../api-requests/category-api.ts'
import { filtersApi } from '../api-requests/filters-api.ts'
import { url_ngrok } from "@/api-requests";
import { favoritesApi } from "@/api-requests/favorites-api";
import { userApi } from "@/api-requests/user-api";
import { recipesApi } from "@/api-requests/recipes-api";


  export default {
created() {
  this.getCards()
  if (localStorage.getItem('userData')) {
        this.userInfo = JSON.parse(localStorage.getItem('userData') as string);
  }
  },

  data() {
    return {
      info: [],
       userInfo: ref(),
     searchQuery: ref(""),
     categories:ref(),
     smallInfo:ref(),
      pageCount: ref(1),
      allPagesCount:ref(),
      showFiltersModal: ref(false),
      filters: ref({
       kcal: "",
       serve: "",
       grams: "",
      }),
      error:ref(),
      tag:ref(),
      currentTag:ref(),
      loading:ref(),
      favFilter:ref(),
      errorText:ref('No result!')
    };
  
  },
  watch: {
   pageCount: async function newPage() {
     this.getCards()
   },
    
   currentTag: async function filterTag(){
      this.filterByTag(this.currentTag?.id);
    
   },
},
  computed: {
    filteredData() {
    if(this.searchQuery){
      return this.info
      .filter(
        (item) => 
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
    this.getCategories();
    try {
      this.info = await recipesApi.getAllRecipesWithIngredientCollection()
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
        if(resultArray.length){
          return  this.info = resultArray;
        }else{
          this.error=true
        }

    } catch (error) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  async  getFilteredCardListByFiltersModal(){
    this.loading = true;
    this.error = false;
    try {
      const filteredCardList = await filtersApi.filtersByFiltersForm(this.filters);
      this.filters = {
        kcal: "",
       serve: "",
       grams: "",
      }
      if (filteredCardList.length) {
     return  this.info = filteredCardList
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
    try {
     this.info = await filtersApi.filtersByTags(tag);
    } catch (err) {
      this.error = true
    } finally {
      this.loading = false;
    }
  },
 handleTagClick (item) {
    this.error = false
    this.favFilter=false;
    this.currentTag = item
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
<!-- <p class="count">Page {{ pageCount }} from {{ allPagesCount }}</p> -->
<button id="show-modal" @click="showFiltersModal = true"> Filters</button>
</div>
<div>

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
</div>
<div  class="pagination_wrapper">
  <ul class="card_list">
  <li class="card"  v-for="(item) in filteredData">
<RouterLink :to="{name : 'recipe' ,params : {id: item.id}}" >
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
  }
  .tag_image{
 width: 30px;
 height: 30px;
 border-radius: 50%;
 align-self: center;
  }
  .tag {
    display: flex;
    flex-direction: row-reverse;
  }
  .tag_title{
    font-size: 1rem;
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
    justify-content: center;
    width:280px;
    height: 330px;
    padding:10px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-secondary);
    border-radius:10px;
    margin:10px;
    color:rgba(0, 0, 255, 0.129);
  }
  #show-modal{
    padding:5px 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:rgb(224, 224, 243);
    font-size: 1rem;
  }
  .title{
    font-size: 1.2rem;
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
  .pagination_wrapper{
    display: flex;
    flex-direction: row;
    justify-content: center;
    width:100%;
  }
  @media (max-width: 450px) {
.arrow{
  height: 30px;
    width: 30px;
}
}
</style>