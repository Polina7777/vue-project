<script lang="ts">
import { ref } from 'vue';
  export default {
   async mounted() {
      this.getLocations()
    },
  data() {
    return {
      info: [],
      searchQuery: ref(""),
      pageCount: ref(1),
      allPagesCount:ref(),
      error:ref(false)
    };
  },
  watch: {
   pageCount: async function newPage() {
    this.getLocations()
   }
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
    async getLocations() {
    this.error = false;
  const response = await fetch('https://rickandmortyapi.com/api/location/?page='+this.pageCount)
  if(response.ok){
    const data = await response.json();
    this.info = data.results
    return  this.allPagesCount = data.info.pages
  } else{
       this.error = true;
  }
    },
    onClickLeftHandler(){
      if(this.pageCount <=1 ){
        return 1
      }
        return  this.pageCount--
    },
    onClickRightHandler(){
     if(this.pageCount === this.allPagesCount){
      return 1
     }
      return this.pageCount++
    }
  },
  
};

</script>


<template>
  <div class="locations_list__wrapper">
    <div class="input_wrapper">
  <input  v-model="searchQuery">
</div>
<p class="count">Page {{ pageCount }} from {{ allPagesCount }}</p>
<div  class="pagination_wrapper">
<button v-if="pageCount>1" class="arrow" @click="onClickLeftHandler"> &lt; </button>
  <ul class="locations_list">
  <li class="locations"  v-for="(item) in filteredData">
<RouterLink :to="{name : 'location' ,params : {id: item.id}}" >
    <h1 class="title">{{item.name}}</h1>
</RouterLink>
  </li>
</ul>
<button v-if="pageCount !==7" class="arrow" @click="onClickRightHandler"> > </button>
</div>
  </div>
</template>



<style scoped>
  .locations_list__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
  }
  .locations_list {
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    justify-content: center;
    background-color: rgb(205, 195, 214);
    width: 100%;
  }
  .image{
 width: 150px;
 height: 150px;
 border-radius: 50%;
 padding: 10px;
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
  .pagination_wrapper{
    display: flex;
    flex-direction: row;
    justify-content: center;
    width:100%;
  }
  .arrow{
    height: 50px;
    width: 50px;
    border-radius: 50%;
    font-size: 1rem;
    color:rgb(157, 145, 167);
    background-color: rgb(230, 225, 234); 
  }
    .locations{
    display: flex;
    align-items: center;
    flex-direction:column;
    justify-content:center;
    align-content: center;
    width:300px;
    height: 121px;
    padding:20px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(156, 140, 170);
    border-radius:10px;
    margin:10px;
    color:rgba(0, 0, 255, 0.129);
  }
  .title, .count{
    /* font-size:20px; */
    font-size: 1rem;
    padding: 10px;
    color:rgba(232, 232, 238, 0.898);
    font-weight: 600;
  }
  @media (max-width: 450px) {
   .arrow{
    height: 30px;
    width: 30px;
}
}
</style>