
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
    getLocations() {
       fetch("https://rickandmortyapi.com/api/location")
      .then(response => response.json())
    .then(data =>(this.info = data.results));
    }
  },

};

</script>


<template>
  <div class="locations_list__wrapper">
    <div class="input_wrapper">
    <h2>Text Input</h2>
  <input v-model="searchQuery">
</div>
  <ul class="locations_list">
  <li class="locations"  v-for="(item) in filteredData">
<RouterLink :to="{name : 'location' ,params : {id: item.id}}" >
    <h1 class="title">{{item.name}}</h1>
</RouterLink>
  </li>
</ul>

  </div>
</template>



<style scoped>
  .locations_list__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }
  .locations_list {
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
    .locations{
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