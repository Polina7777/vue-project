<script lang="ts">

export default {
    // async mounted() {
    //   this.getLocation(this.$route.params.id)
    // },
    created() {
      this.getLocation(this.$route.params.id)
  },
data() {
  return {
    // id: this.cardId,
    info: {name:String,type:String,dimension:String}
  };
},
methods:{
    getLocation(id: string | string[]) {
    fetch('https://rickandmortyapi.com/api/location/'+ id)
      .then(response => response.json())
      .then(data => (this.info = data));
    },
    goBack(){
        this.$router.push('/locations')
       }
},

}

</script>

<template>
    <button class="back_button" @click="goBack">Go Back</button>
  <div class="card_wrapper">
<div class="card">
    <h1 :title=info.name class="title"> {{info?.name}}</h1>
    <p  :type=info.type class="type"> Type: {{ info?.type }}</p>
    <p  :dimension=info.dimension class="dimension"> Dimension: {{ info?.dimension }}</p>
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
  .back_button{
    padding:5px 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(135, 121, 148);
    border-radius:10px;
    color:rgb(224, 224, 243);
    font-size: 17px;
   
align-self: center;
  }
  .card_wrapper {
  padding: 40px;
  }
 .card {
    display: flex;
    align-items: center;
    flex-direction:column;
    align-items:center;
   /* min-width:500px; */
    padding:20px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(156, 140, 170);
    border-radius:10px;
    margin:10px;
    color:rgb(224, 224, 243);
  }
  .title{
    /* font-size:40px; */
    font-size: 2rem;
    padding: 10px;
  }
  .dimension, .type{
    /* font-size:20px; */
    font-size: 1rem;
    padding: 10px;
  }
 
</style>