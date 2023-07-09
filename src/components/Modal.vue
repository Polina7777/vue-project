<script lang="ts"  >

export default{
  props:['show','process','ingredients'],

  
data() {
    return {
      scrollTop: 0,
      stepsCount:this.process.length,
      height:window.innerHeight/2.2,
      width:window.innerWidth,
      
    };
  },
methods:{

handleScroll(event) {
      this.scrollTop = event.currentTarget.scrollTop;
    },
    styleCircle: function(index) {
      let style = {};
      if (index +1 === 1 || this.scrollTop >= index * 90 ){
         style.backgroundColor = 'rgb(114, 100, 126)';
      }else if (this.stepsCount<=2 && this.scrollTop >= index * 20 ) {
        style.backgroundColor = 'rgb(114, 100, 126)';
      }
      return style;
    }

},
computed: {
    myStyles () {
      return {
        backgroundColor: 'rgb(114, 100, 126)',
        height:this.scrollTop> 0 ? `${this.scrollTop+40}px`: 0,
        maxHeight:`${this.height-100}px`,
        minHeight:this.stepsCount <= 2 && this.scrollTop>0 ? '340px': '0px'

      }
    },
    styleForHeight () {
      return {
        height:`${this.height-100}px`,
        maxHeight:`${this.height-100}px`,
        minHeight:this.stepsCount <= 2 ? 170*this.stepsCount:`${this.height-100}px`   
 
      }
    },

}

}
</script>

<template>
  
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
            <button
              class="modal-default-button"
              @click="$emit('close')"
            >Close</button>
          <slot name="header">
          </slot>
        </div>
        <div class="modal-body">
            <slot name="body">
            <ul class="ingredients_list">
  <li class="ingredient"  v-for="(item) in ingredients">
   <img class="ingredient_image" :src="item.attributes.image_url" />
  </li>
   </ul>
   <div class="string" :style="styleForHeight"></div>
  <div class="general_string" :style="myStyles" ></div>
  <div class="scroll_wrapper" :style="styleForHeight"  @scroll="handleScroll" >

          <ul class="step_list">

  <li class="step"  v-for="(item,index) in process">
    <div class="title_wrapper">
      <p class="circle" :style="styleCircle(index)"></p>
<a class="name" :style="{ 'font-size': width/100 * 2 + 'px' }">{{item.attributes.name}}</a>
  </div>
    <a class="description" :style="{ 'font-size': width/100 * 1.5  + 'px' }">{{item.attributes.description}}</a>
  </li>
   </ul>
  </div>
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
.scroll_wrapper {
  height: 400px;
  overflow-y: scroll;
  position: relative;

}
.modal-container {
  width: 60%;
  height: 60%;
  margin: auto;
  padding: 10px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  border:2px solid rgb(199, 199, 232);
  background-color: var(--background-general);
border-radius:10px;
color:rgba(0, 0, 255, 0.129);
position: relative;
}
.step_list{
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding-left: 20px;

}
.modal-default-button{
    padding:7px 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:10px;
    color:rgb(224, 224, 243);
    font-size: 1rem;
  }
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin-top: 50px;
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
.description {
list-style-type: none;
text-decoration: none;
font-size: 1rem;
padding: 10px 40px;
}
.step{
list-style-type: none;
text-decoration: none;
font-size: 1.2rem;
font-weight: 600;
padding-left: 10px;
height:200px;

}
.string{
height: 100%;
background-color: rgb(199, 199, 232);
width: 3px;
position: absolute;
left: 49px;

}
.general_string{
  width: 3px;
  background-color: var(--background-general);
position: absolute;
left: 49px;
}
.title_wrapper {
  display: flex;
flex-direction: row;
gap:20px;
position: relative;
}
.circle{
  width: 30px;
  height: 30px;
  border-radius: 50%;

  border:2px solid var(--background-general);
  background-color: rgb(199, 199, 232);
  position: absolute;
left: -24px;
}
.name{
  padding-left: 40px;
  font-weight: 600;
}
.ingredients_list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap:10px;
  list-style: none;
  margin-bottom: 30px;
}
.ingredient_image{
  width: 30px;
  height: 30px;
 justify-content: "center";
}
.ingredient{
  padding:7px 10px;
    border:2px solid rgb(199, 199, 232);
    background-color: var(--background-general);
    border-radius:50%;
}


</style>