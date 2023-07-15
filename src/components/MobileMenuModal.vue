<script lang="ts"  >


// const props = defineProps({
//  showMobileModal: Boolean,
//   userName:String,
//   showAuthModal:Function,
//   showRegModal:Function,
//   isLoggedIn:Boolean,
//   signOut:Function,


// })
export default{
props:['showMobileModal', 'userName', 'showAuthModal', 'showRegModal', 'isLoggedIn', 'signOut'],
methods:{

}
}
</script>
<template>
  <Transition name="modal">
    <div v-if="showMobileModal" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
            <button
              class="modal-default-button"
              @click="$emit('close')"
            >Close</button>
          <slot name="header">default header</slot>
        </div>
        <div class="modal-body">
            <slot name="body">
       <div v-if="isLoggedIn" class="hello_wrapper">
      <p class="hello"> Hello, {{userName}} !</p>
      <img class="hello_image" src="https://www.svgrepo.com/show/402888/waving-hand.svg"/>
    </div>
                <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/recipes">Recipes</RouterLink>
      </nav>
      <div class="auth_wrapper">
      <button class="auth" id="show-modal" @click="showAuthModal" v-if="!isLoggedIn"> Sign in </button>
      <button class="auth"  id="show-modal" @click="showRegModal" v-if="!isLoggedIn"> Sign up </button>
    </div>
      <button class="auth"  id="show-modal" @click="signOut" v-if="isLoggedIn"> Sign out </button>
   </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
/* width: 40%; */
min-width: 270px;
/* margin: auto; */
padding: 10px;
background-color: #fff;
border-radius: 2px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
transition: all 0.3s ease;
border: 2px solid rgb(199, 199, 232);
background-color: var(--background-general);
border-radius: 10px;
color: rgba(0, 0, 255, 0.129);
}

.modal-default-button{
    padding:5px 8px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:rgb(240, 240, 245);
    font-size: 0.7rem;
  }
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 10px 0;
  display: flex;
flex-direction: column;
justify-content: center;
gap:10px;
}

.modal-default-button {
  float: right;
}


.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

nav{
  display: flex;
  flex-direction: column;
  align-items: self-start;
  font-size: 21px;
}


.hello{
  font-size: 21px;
}
</style>