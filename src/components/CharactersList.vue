
<script lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

  export default {
   async mounted() {
      this.getCards()
    },
  data() {
    return {
      info: [],
     searchQuery: ref(""),
    };
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
       fetch("https://rickandmortyapi.com/api/character")
      .then(response => response.json())
    .then(data =>(this.info = data.results));
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
  <ul class="card_list">
  <li class="card"  v-for="(item) in filteredData">
<RouterLink :to="{name : 'character' ,params : {id: item.id}}" >
    <h1 :title = item.name class="title">{{item.name}}</h1>
    <img :src="item.image" class="image"/>
</RouterLink>
  </li>
</ul>

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
 
</style>