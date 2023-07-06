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
<!-- <div class="status_input">
  <h2>Status</h2>
  <div class="radio_wrapper">
  <input type="radio" id="alive" value="alive" v-model="status">
  <label for="alive">Alive</label>

  <input type="radio" id="dead" value="dead" v-model="status">
  <label for="dead">Dead</label>

  <input type="radio" id="unknow" value="unknow" v-model="status">
  <label for="unknow">Unknow</label>
</div>
</div> -->
<!-- <div class="gender_input">
  <h2>Gender</h2>
  <div class="radio_wrapper">
  <input type="radio" id="female" value="female" v-model="gender">
  <label for="female">Female</label>

  <input type="radio" id="male" value="male" v-model="gender">
  <label for="male">Male</label>

  <input type="radio" id="genderless" value="genderless" v-model="gender">
  <label for="genderless">Genderless</label>
  <input type="radio" id="unknow" value="unknow" v-model="gender">
  <label for="unknow">Unknow</label>
</div>
</div> -->
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
  /* font-size: 15px; */
  font-size: 1rem;
}
.status_input, .gender_input, .name {
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
    background-color: rgb(114, 100, 126);
    border-radius:10px;
    color:rgb(240, 240, 245);
    /* font-size: 17px; */
    font-size: 1rem;
    margin-top: 15px;
}
.radio_wrapper{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:10px;
  padding: 10px;
}
.name_input{
  width:100%;
  /* font-size: 15px; */
  font-size: 1rem;
}
@media (max-width: 550px) {
  .radio_wrapper{
  display: flex;
 flex-wrap: wrap;
  align-items: center;
  padding: 5px;
  gap:5px;
}
.status_input, .gender_input, .name {
    margin:5px 0;
    padding: 5px;
    outline:none;
    flex-wrap: wrap;
    
}
.filters_wrapper {
    padding: 0 10px;
}
}
  </style>