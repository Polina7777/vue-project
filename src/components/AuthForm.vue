<script lang="ts" >
import useValidate from '@vuelidate/core'
import { required,email,numeric,minLength} from '@vuelidate/validators'
import { ref } from 'vue'
import { userApi } from '@/api-requests/user-api'

export default {
  props: ['user'],
  data () {
    return {
    v$: useValidate(),
     email:'',
     password:'',
     errMsg: ref(),
     rules:{
      email: { required,email},
      password:{required,numeric,minLength:minLength(6)}
    },
    error:ref()
    }
  },
  methods: {
  async submit() {
    const isFormCorrect = await this.v$.$validate()
    if (isFormCorrect) {
      this.login()
      this.$router.push('/')
    }else {
        alert('Form failed validation')
     }
    },

async login() {             
  try {
  const res = await userApi.loginUser(this.email,this.password)
  console.log(res)
  if (res.data){
    localStorage.setItem('jwt', res.jwt)
     localStorage.setItem('userData', JSON.stringify(res.user))
    this.$router.push('/')
    this.user({
      jwt:res.jwt,
      user:res.user
    })
  } else {
    alert(res.error.message)
  }
    
   } catch(error) {
    console.log(error)
      this.error = true
       this.password = ''
         }
       },
  userBearer(jwt,user){
    try {
      const res2 = userApi.userBearer(jwt,user)
    console.log(res2)
      this.$router.push('/')
    } catch (error) {
      this.error = true
      console.log(error)
    }
  }
},
validations() {
    return {
      email: { required,email,$autoDirty: true,$lazy: true},
      password:{required,numeric,minLength:minLength(6),$autoDirty: true,$lazy: true }
  }
  },
}
</script>
<!-- 
//     signIn(){ 
  //     signInWithEmailAndPassword(getAuth(),this.email,this.password)
  //   .then((data) => {
  //     console.log('Successfully logged in!');
  //     this.$router.push('/')
  //   })
  //   .catch(error => {
  //     switch (error.code) {
  //       case 'auth/invalid-email':
  //           this.errMsg.value = 'Invalid email'
  //           break
  //       case 'auth/user-not-found':
  //           this.errMsg.value = 'No account with that email was found'
  //           break
  //       case 'auth/wrong-password':
  //          this.errMsg.value = 'Incorrect password'
  //           break  
  //       default:
  //           this.errMsg.value = 'Email or password was incorrect'
  //           break
  //     }
  //   });
  // } -->

<template>
    <div class="auth_inputs__wrapper">
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
  color:red
}

  </style>