<script lang='ts'>
import { ref } from 'vue'
import useValidate from '@vuelidate/core'
import { required,email,numeric,minLength,maxLength } from '@vuelidate/validators'
import { userApi } from '@/api-requests/user-api'
import { favoritesApi } from '@/api-requests/favorites-api'


export default {
  props: ['user'],
  data () {
    return {
      v$: useValidate(),
     name: '',
     surname: '',
     email:'',
     password:'',
     errMsg: ref<string>(),
     rules:{
      name:{ required, minLength:minLength(3) },
      surname:{ required, minLength:minLength(3) },
      email: { required, email},
      password:{ required,numeric,minLength:minLength(6) }
    },
    error:ref<string>(),
    userId:ref<string>(),
    }
  },
  methods: {
  async submit() {
    const isFormCorrect = await this.v$.$validate()
     if (isFormCorrect) {
      this.register()
      this.$router.push('/')
    }else {
        alert('Form failed validation')
     }
    },
     async register(){
      try {
     const collection = await favoritesApi.createFavoritesCollection()
     const res = await userApi.registerUser(this.name,this.surname,this.email,this.password,collection.id)
     if(res.jwt){ 
     localStorage.setItem('jwt', res.jwt);
     localStorage.setItem('userData', JSON.stringify(res.user));
     this.$router.push('/')
   this.user({
      jwt:res.jwt,
      user:res.user
    })
     }else if(res.error){
    alert(res.error.message)
    this.name = '';
     this.surname = '';
     this.email = '';
     this.password = '';

     }
    }
    catch (err) {
      console.log(err);
       this.password = ''
    }
},


},
validations() {
    return {
      name:{required,minLength:minLength(3),maxLength:maxLength(15),$autoDirty: true ,$lazy: true },
      surname:{required,minLength:minLength(3),maxLength:maxLength(15),$autoDirty: true,$lazy: true  },
      email: { required,email,$autoDirty: true,$lazy: true},
      password:{required,numeric,minLength:minLength(6),$autoDirty: true,$lazy: true }
  }
  },}
</script>


<template>
    <div class="auth_inputs__wrapper">
  <input class="auth_input" placeholder="Name" v-model="name"> 
  <span class='error' v-if="v$.name.$error">
        {{ v$.name.$errors[0].$message }}
      </span>
  <input class="auth_input" placeholder="Surname" v-model="surname"> 
  <span class='error' v-if="v$.surname.$error">
        {{ v$.surname.$errors[0].$message }}
      </span>
  <input class="auth_input" type="email" placeholder="Email" v-model="email"> 
  <span class='error' v-if="v$.email.$error">
        {{ v$.email.$errors[0].$message }}
      </span>
  <input class="auth_input" type="password" placeholder="Password" v-model="password"> 
  <span class='error' v-if="v$.password.$error">
        {{ v$.password.$errors[0].$message }}
      </span>
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
    color:rgb(229, 229, 242);
    padding-bottom: 30px;
}
h2{
  font-size: 1rem;
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
  font-size: 1rem;
}
.submit_button{
    padding:5px 8px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:rgb(240, 240, 245);
    font-size: 1rem;
    align-items: center;
}
.error{
  font-size: 0.7rem;
  color:rgb(168, 11, 11)
}

  </style>