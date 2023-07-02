
<script lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import Paginator from "./Paginator.vue"

  export default {
    
   async mounted() {
      this.getCards()
    },
    
  data() {
    return {
      info: [],
     searchQuery: ref(""),
      pageCount: ref(1),
    };
  },
  // watch: {
  //   '$arrow:right': {
  //     handler() {
  //       this.onClickRightHandler();
  //     },
  //     immediate: true
  //   } ,
  //   '$arrow:left': {
  //     handler() {
  //       this.onClickLeftHandler();
  //     },
  //     immediate: true
  //   } 
  // },
  watch: {
   pageCount: async function newPage() {
    this.getCards()
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
    getCards() {
       fetch('https://rickandmortyapi.com/api/character/?page='+this.pageCount)
      .then(response => response.json())
    .then(data =>(this.info = data.results));
    },
    onClickLeftHandler(){
      console.log(this.pageCount)
      if(this.pageCount === 0){
        console.log(this.pageCount)
        return 0
      }else{
        console.log(this.pageCount)
        return  this.pageCount--
      }
    },
    onClickRightHandler(){
     if(this.pageCount === 10){
      console.log(this.pageCount)
      return 10
     }else{
      console.log(this.pageCount)
      return this.pageCount++
     }
  
  
    }
  },
  }
</script>


<template>
  <div class="card_list__wrapper">
    <div class="input_wrapper">
    <h2>Text Input</h2>
  <input v-model="searchQuery">
</div>
<div  class="pagination_wrapper">
<button class="arrow" @click="onClickLeftHandler"> '&lt;'</button>
  <ul class="card_list">
  <li class="card"  v-for="(item) in filteredData">
<RouterLink :to="{name : 'character' ,params : {id: item.id}}" >
    <h1 :title = item.name class="title">{{item.name}}</h1>
    <img :src="item.image" class="image"/>
</RouterLink>
  </li>
</ul>
<button class="arrow" @click="onClickRightHandler"> '>'</button>
</div>
  </div>
 
</template>




<style scoped>
  .card_list__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }
  .card_list {
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    justify-content: center;
    background-color: rgb(205, 195, 214);
  }
  .image{
 width: 150px;
 height: 150px;
 border-radius: 50%;
 padding: 10px;
 align-self: center;
  }
  .arrow{
    font-size: 20px;
  }
    .card {
    display: flex;
    align-items: center;
    flex-direction:column;
    justify-content:center;
    align-content: center;
    width:400px;
    padding:20px;
    border:3px solid rgb(199, 199, 232);
    background-color: rgb(156, 140, 170);
    border-radius:10px;
    margin:10px;
    color:rgba(0, 0, 255, 0.129);
  }
  .title{
    font-size:20px;
    padding: 10px;
  }
  .pagination_wrapper{
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
 
</style>