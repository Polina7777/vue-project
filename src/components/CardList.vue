
<script lang="ts">

  export default {
   async mounted() {
      this.getCards()
    },
  data() {
    return {
      info: null
    };
  },
  methods: {
    getCards() {
       fetch("https://jsonplaceholder.typicode.com/albums/1/photos")
      .then(response => response.json())
      .then(data => (this.info = data));
    }
  },

};

</script>

<template>
  <div class="card_list">
  <ul>
  <li class="card"  v-for="(item, index) in info">
<RouterLink :to="{name : 'card' ,params : {id: item.id}}" >
    <h1 class="title">{{item.title}}</h1>
    <img :src="item.url" class="image"/>
</RouterLink>
  </li>
</ul>

  </div>
</template>



<style>
  .card_list {
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    align-items: center;

  }
  .image{
    height:40px;
    width:40px;
    border-radius:20px;
  }
    .card {
    display: flex;
    align-items: center;
    flex-direction:column;
    width:300px;
    padding:20px;
    border:3px solid yellow;
    border-radius:10px;
    margin:10px;
  }
  .title{
    color:blue;
    font-size:15px
  }
  .discription{
    color:blue;
  }
</style>