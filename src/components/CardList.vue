
<script lang="ts">

  export default {
   async mounted() {
      this.getCards()
    },
  data() {
    return {
      info: null,
      id:null,
    };
  },
  methods: {
    getCards() {
       fetch("https://rickandmortyapi.com/api/character")
      .then(response => response.json())
    .then(data =>(this.info = data.results));
    },
    generateId(){
      
    }
  },

};

</script>


<template>
  <div class="card_list__wrapper">
  <ul class="card_list">
  <li class="card"  v-for="(item, index) in info">
<RouterLink :to="{name : 'card' ,params : {id: item.id}}" >
    <h1 class="title">{{item.name}}</h1>
    <img :src="item.image" class="image"/>
</RouterLink>
  </li>
</ul>

  </div>
</template>



<style scoped>
  .card_list__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card_list {
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    align-items: center;
    background-color: rgb(205, 195, 214);
    display: flex;
flex-direction: row;
flex-wrap: wrap;
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
    border:3px solid rgb(127, 127, 164);
    background-color: rgb(103, 85, 119);
    border-radius:10px;
    margin:10px;
    color:rgba(0, 0, 255, 0.129);
  }
  .title{
    font-size:20px;
    padding: 10px;
  }
 
</style>