
<script lang="ts">
import { ref, watch } from "vue";
import FiltersModal from './FiltersModal.vue'
import Error from "./Error.vue";

  export default {
created() {
  this.getCards()
  },

  data() {
    return {
      info: [],
     searchQuery: ref(""),
      pageCount: ref(1),
      allPagesCount:ref(),
      showFiltersModal: ref(false),
      filterName:ref(''),
      filterStatus:ref(''),
      filterGender:ref(''),
      filters: ref({
        name:'',
        status:'',
        gender:''
      }),
      error:ref()
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

},
  computed: {
    filteredData() {
    return this.info
      .filter(
        (item) => 
       { 
      return  item.name.toLowerCase().includes(this.searchQuery.toLowerCase())}
      );
  },
},
  methods: {
    async getCards() {
    this.error = false;
  const response = await fetch('https://rickandmortyapi.com/api/character/?page='+this.pageCount+'&name='+this.filters.name+'&status='+this.filters.status+'&gender='+this.filters.gender)
  if(response.ok){
    const data = await response.json();
    this.info = data.results
    return  this.allPagesCount = data.info.pages
  } else{
       this.error = true;
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
      return this.filters = data
    },
  //   async getCardsWithFilters() {
  //  const response = await fetch('https://rickandmortyapi.com/api/character/?page='+this.pageCount+'&name='+this.filters.name+'&status='+this.filters.status+'&gender='+this.filters.gender)
  // if(response.ok){
  //   const data = await response.json();
  //   this.allPagesCount = data.info.pages
  //   this.info = data.results
  // }else{
  //   const data = await response.json();
  //   console.log(data.error)
  //      this.error = data.error;
  // }
  //   },
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
<button id="show-modal" @click="showFiltersModal = true"> Filters</button>
</div>
<div  class="pagination_wrapper">
<button v-if="(pageCount>1 && !searchQuery.length)" class="arrow" @click="onClickLeftHandler"> &lt; </button>
  <ul class="card_list">
  <li class="card"  v-for="(item) in filteredData">
<RouterLink :to="{name : 'character' ,params : {id: item.id}}" >
    <h1 :title = item.name class="title">{{item.name}}</h1>
    <img :src="item.image" class="image"/>
</RouterLink>
  </li>
</ul>

<button v-if="(pageCount !== allPagesCount && !searchQuery.length && allPagesCount !==1)" class="arrow" @click="onClickRightHandler"> > </button>
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
    height: 210px;
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