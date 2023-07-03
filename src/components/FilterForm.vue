<script lang="ts" >
export default {
  props: ['submitFilters'],
  data () {
    return {
     name: '',
      status: '',
      gender:''
    }
  },

  methods: {
    submit () {
    return this.submitFilters({
        name: this.name,
        status: this.status,
       gender: this.gender,
      })
    }
  }
}
</script>

<template>
     <button @click=submit>Submit</button>
    <div class="filters_wrapper">
   <div class="name_input">
  <input class="name" placeholder="Name" v-model="name"> 
</div>
<div class="status_input">
  <h2>Status</h2>
  <div class="radio_wrapper">
  <input type="radio" id="alive" value="alive" v-model="status">
  <label for="alive">Alive</label>

  <input type="radio" id="dead" value="dead" v-model="status">
  <label for="dead">Dead</label>

  <input type="radio" id="unknow" value="unknow" v-model="status">
  <label for="unknow">Unknow</label>
</div>
  <span>Picked: {{ status }}</span>
</div>
<div class="gender_input">
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
  <span>Picked: {{ gender }}</span>
</div>
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
  font-size: 15px;
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
.radio_wrapper{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:10px;
}
.name_input{
  width:100%;
  font-size: 15px;
}

  </style>