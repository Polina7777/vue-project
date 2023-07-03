<script lang="ts" >
export default {
  props: ['submitAuth'],
  data () {
    return {
     name: '',
     surname: '',
     email:'',
     password:''
    }
  },

  methods: {
    submit () {

    return this.submitAuth({
        name: this.name,
        surname: this.surname,
        email: this.email,
        password: this.password
      })
    }
  }
}
</script>

<template>
    <div class="auth_inputs__wrapper">
  <input class="auth_input" placeholder="Name" v-model="name"> 
  <input class="auth_input" placeholder="Surname" v-model="surname"> 
  <input class="auth_input" type="email" placeholder="Email" v-model="email"> 
  <input class="auth_input" type="password" placeholder="Password" v-model="password"> 
</div>
<button class='submit_button' @click=submit>Submit</button>
</template>

<style scoped>
.auth_inputs__wrapper {
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
.auth_input, .name {
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
.submit_button{
    padding:5px 8px;
    border:2px solid rgb(199, 199, 232);
    background-color: rgb(114, 100, 126);
    border-radius:10px;
    color:rgb(240, 240, 245);
    font-size: 17px;
    align-items: center;
}

  </style>