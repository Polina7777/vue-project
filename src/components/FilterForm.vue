<script lang="ts" >
export default {
  props: ['submitFilters'],
  data () {
    return {
      kcal: "",
     serve: "",
      grams: "",
    }
  },

  methods: {
    submit () {
    return this.submitFilters({
      kcal: this.kcal,
      serve: this.serve,
      grams: this.grams,
  
      })
    }
  }
}
</script>

<template>
    <div class="filters_wrapper">
   <div class="name_input">
    <h2>Kcal:</h2>
  <input class="name" placeholder="kcal" v-model="kcal"> 
</div>
<div class="name_input">
  <h2>Serve:</h2>
  <input class="name" placeholder="serve" v-model="serve"> 
</div>
<div class="name_input">
  <h2>Grams:</h2>
  <input class="name" placeholder="grams" v-model="grams"> 
</div>
<button class="submit_button" @click=submit>Submit</button>
</div>
</template>

<style scoped>
.filters_wrapper {
    display: flex;
    align-items: center;
    flex-direction:column;
    justify-content:center;
    align-content: center;
    padding: 0 20px;
    color:rgb(229, 229, 242);
}
h2{
  font-size: 1rem;
}
.name {
  display: flex;
  flex-direction: column;
 color:rgb(233, 233, 239) ;
 width: 100%;
     border:2px solid rgb(199, 199, 232);
    background-color: transparent;
    border-radius:10px;
    margin:10px 0;
    padding: 10px;
    outline:none;
    flex-wrap: wrap;
    
}
.submit_button{
  padding:7px 12px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:rgb(240, 240, 245);
    font-size: 1rem;
    margin-top: 15px;
}
.name_input{
  width:100%;
  font-size: 1rem;
}
@media (max-width: 550px) {
.filters_wrapper {
    padding: 0 10px;
}
}
  </style>