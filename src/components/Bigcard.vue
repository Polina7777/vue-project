<script lang="ts">
export default {
    async mounted() {
      this.getCard(this.$route.params.id)
    },
  props: ['cardId'],
data() {
  return {
    id: this.cardId,
    info: null
  };
},
methods:{
    getCard(id: string | string[]) {
    fetch('https://rickandmortyapi.com/api/character/'+ id)
      .then(response => response.json())
      .then(data => (this.info = data));
    }
},

}

</script>

<template>
  <div class="card_wrapper">
<div class="card">
    <h1 class="title"> {{info?.name}}</h1>
    <img :src="info?.image" class="image"/>
   <p class="status"> {{ info?.status }}  </p>
   <p class="species"> {{ info?.species }}  </p>
   <p class="gender"> {{ info?.gender }}  </p>
    </div>
  </div>
</template>


<style scoped>

  .image{
 width:200px;
 height: 200px;
 border-radius: 100px;
 padding: 10px;
 align-self: center;
  }
  .card_wrapper {
    display: flex;
    justify-content: center;
  padding: 40px;
  }
 .card {
    display: flex;
    align-items: center;
    flex-direction:column;
    justify-content:center;
    align-content: center;
   min-width:500px;
    padding:20px;
    border:3px solid rgb(127, 127, 164);
    background-color: rgb(103, 85, 119);
    border-radius:10px;
    margin:10px;
    color:rgb(224, 224, 243);
  }
  .title{
    font-size:40px;
    padding: 10px;
  }
  .status, .species, .gender{
    font-size:20px;
    padding: 10px;
  }
 
</style>