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
    getLocations() {
       fetch('https://rickandmortyapi.com/api/location/?page='+this.pageCount)
      .then(response => response.json())
    .then(data =>(this.info = data.results));
    },
    onClickLeftHandler(){
      if(this.pageCount <=1 ){
        return 1
      }
        return  this.pageCount--
    },
    onClickRightHandler(){
     if(this.pageCount === 7){
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
<p class="count">Page {{ pageCount }}</p>
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
    width: 400px;
    padding: 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(230, 225, 234);
    border-radius:10px;
    font-size: 15px;
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
    font-size: 20px;
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
    font-size:20px;
    padding: 10px;
    color:rgba(232, 232, 238, 0.898);
    font-weight: 600;
  }
 
</style>