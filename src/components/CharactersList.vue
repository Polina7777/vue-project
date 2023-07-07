
<script lang="ts">
import { ref, watch } from "vue";
import FiltersModal from './FiltersModal.vue'
import Error from "./Error.vue";
import { categoryApi } from '../api-requests/category-api.ts'
import { filtersApi } from '../api-requests/filters-api.ts'
import { url_ngrok } from "@/api-requests";
import { favoritesApi } from "@/api-requests/favorites-api";
import { userApi } from "@/api-requests/user-api";
import { recipesApi } from "@/api-requests/recipes-api";
import { threadId } from "worker_threads";
import { runInThisContext } from "vm";

  export default {
created() {
  this.getCards()
  },

  data() {
    return {
      info: [],
     searchQuery: ref(""),
     categories:ref(),
     smallInfo:ref(),
      pageCount: ref(1),
      allPagesCount:ref(),
      showFiltersModal: ref(false),
      filterName:ref(''),
      filterStatus:ref(''),
      filterGender:ref(''),
      filters: ref({
       kcal: "",
       serve: "",
       grams: "",
      }),
      // filters: ref(),
      error:ref(),
      tag:ref(),
      currentTag:ref(),
      loading:ref(),
      favFilter:ref()
    };
  
  },
  watch: {
   pageCount: async function newPage() {
     this.getCards()
   },
   filters: async function filterList() {
    this.pageCount = 1;
    this.getCards()
   },
   currentTag: async function filterTag(){
    console.log(this.currentTag,'current')
      this.filterByTag(this.currentTag?.id);
    
   },
},
  computed: {
    filteredData() {
      console.log(this.info,'nknknnnknk')
 return this.info
      .filter(
        (item) => 
       { 
      return  item.attributes.title.toLowerCase().includes(this.searchQuery.toLowerCase())}
      );
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
      console.log(err);
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
      console.log(err);
    } finally {
      this.loading = false;
    }
    },
    async filterByFavorites(){
      this.loading = true;
      this.favFilter=true;
      this.error = false;
    try {
      const user = await userApi.getUsersById("1");
      const filteredList = await favoritesApi.getFavorites(user.favorite.id);
      console.log(filteredList,'liiist')
      const idArr = filteredList.map((item: any) => item.id);
      const resultArray = [];
      for (const item of idArr) {
        const response = await fetch(
          `${url_ngrok}api/foods/${item}?populate=*`
        );
        const result = await response.json();
        resultArray.push(result.data);
      }
      this.info = resultArray;
      // setCardList(resultArray);
    } catch (error) {
      this.error = true;
      console.log(error);
    } finally {
      this.loading = false;
    }
  },
  async  getFilteredCardListByFiltersModal(){
    this.loading = true;
    this.error = false;
    console.log(this.filters,'this.filters')
    try {
      const filteredCardList = await filtersApi.filtersByFiltersForm(this.filters);
      this.filters = {
        kcal: "",
       serve: "",
       grams: "",
      }
      if (filteredCardList.length) {
       console.log(filteredCardList,'thiiiiiiis')
       this.info = filteredCardList
        // setCardList(filteredCardList);
      } else {
        this.error = true;
      }
      this.loading = false;
    } catch (err) {
      this.error = true;
      console.log(err);
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
      console.log(data,'data')
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
      // this.info = filteredList
    } catch (err) {
      this.error = true
      console.log(err);
    } finally {
      this.loading = false;
    }
  },
 handleTagClick (item) {
    this.error = false
    this.favFilter=false;
    this.currentTag = item
    // this.filterByTag(item.id)
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
<!-- <button v-if="(pageCount>1 && !searchQuery.length)" class="arrow" @click="onClickLeftHandler"> &lt; </button> -->
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

<!-- <button v-if="(pageCount !== allPagesCount && !searchQuery.length && allPagesCount !==1)" class="arrow" @click="onClickRightHandler"> > </button> -->
</div>
 </div>
 <div v-if="error" class="error_wrapper">
<Error :errorText='error'/>
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
    background-color: rgb(114, 100, 126);
    border-radius:10px;
    color:rgb(240, 240, 245);
    /* font-size: 17px; */
    font-size: 1rem;
  }
  .card_list {
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    justify-content: center;
    background-color: rgb(205, 195, 214);
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
    border:1px solid rgb(207, 234, 102);
    background-color: rgb(94, 83, 103);
    color:rgb(207, 234, 102);
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
    background-color: rgb(230, 225, 234);
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
    /* font-size: 20px; */
    font-size: 1rem;
    color:rgb(157, 145, 167);
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
    background-color: rgb(156, 140, 170);
    border-radius:10px;
    margin:10px;
    color:rgba(0, 0, 255, 0.129);
  }
  #show-modal{
    padding:5px 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(135, 121, 148);
    border-radius:10px;
    color:rgb(224, 224, 243);
    /* font-size: 17px; */
    font-size: 1rem;
  }
  .title{
    /* font-size:20px; */
    font-size: 1.2rem;
    /* padding: 10px; */
  }
  .description{
    font-size: 0.8rem;
    padding: 15px;
  }
.count{
    /* font-size:20px; */
    font-size: 1rem;
    padding: 10px;
    color:rgba(232, 232, 238, 0.898);
    font-weight: 600;
  }
  .title_modal{
    color:rgb(240, 240, 245);
    /* font-size:21px; */
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