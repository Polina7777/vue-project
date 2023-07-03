
<script lang="ts">
import { ref } from "vue";
import FiltersModal from './FiltersModal.vue'
  export default {
    
   async mounted() {
      this.getCards()
    },
    
  data() {
    return {
      info: [],
     searchQuery: ref(""),
      pageCount: ref(1),
      showFiltersModal: ref(false),
      filterName:ref(''),
      filterStatus:ref(''),
      filterGender:ref(''),
      filters: ref()
    };
  },
  watch: {
   pageCount: async function newPage() {
    this.getCards()
   },

   filters: async function newPage() {
    this.getCardsWithFilters()
   },

},
  computed: {
    filteredData() {
      console.log(this.searchQuery)
    return this.info
      .filter(
        (item) => 
       { 
      return  item.name.toLowerCase().includes(this.searchQuery.toLowerCase())}
      );
  },
},
  methods: {
    getCards() {
       fetch('https://rickandmortyapi.com/api/character/?page='+this.pageCount)
      .then(response => response.json())
    .then(data =>(this.info = data.results));
    },
    onClickLeftHandler(){
      if(this.pageCount <=1){
        return 1
      }
        return  this.pageCount--
    },
    onClickRightHandler(){
     if(this.pageCount === 11){
      return 1
     }
      return this.pageCount++
    },
    submitFilters (data: any) {
      this.showFiltersModal=false;
      return this.filters = data
    },
    getCardsWithFilters() {
       fetch('https://rickandmortyapi.com/api/character/?page=1'+'&name='+this.filters.name+'&status='+this.filters.status+'&gender='+this.filters.gender)
      .then(response => response.json())
    .then(data =>(this.info = data.results));
    },
  },
  components: { FiltersModal }
  }
</script>


<template>
  <div class="card_list__wrapper">
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
<div>
<p class="count">Page {{ pageCount }}</p>
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

<button v-if="(pageCount !== 11 && !searchQuery.length)" class="arrow" @click="onClickRightHandler"> > </button>
</div>
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
    width: 400px;
    padding: 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(230, 225, 234);
    border-radius:10px;
    font-size: 15px;
    color:rgb(113, 101, 123);
    margin: 15px;
    outline:none;
  }
  .arrow{
    height: 50px;
    width: 50px;
    border-radius: 50%;
    font-size: 20px;
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
    font-size: 17px;
  }
  .title{
    font-size:20px;
    /* padding: 10px; */
  }
.count{
    font-size:20px;
    padding: 10px;
    color:rgba(232, 232, 238, 0.898);
    font-weight: 600;
  }
  .title_modal{
    color:rgb(240, 240, 245);
    font-size:21px;
  }
  .pagination_wrapper{
    display: flex;
    flex-direction: row;
    justify-content: center;
    width:100%;
  }
 
</style>