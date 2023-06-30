<script lang="ts">
export default {
    async mounted() {
      this.getCard(this.$route.params.id)
    },
data() {
  return {
    id: this.cardId,
    info: {name:String,status:String,species:String,gender:String}
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
   <p class="status"> Status: {{ info?.status }}  </p>
   <p class="species">Species: {{ info?.species }}  </p>
   <p class="gender"> Gender: {{ info?.gender }}  </p>
   
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
  padding: 40px;

  }
 .card {
    display: flex;
    align-items: center;
    flex-direction:column;
    align-items: center;
   min-width:500px;
    padding:20px;
    border:3px solid rgb(199, 199, 232);
    background-color: rgb(156, 140, 170);
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