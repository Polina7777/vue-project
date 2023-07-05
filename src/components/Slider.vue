<script lang="ts">
//local registration
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";
export default {
    data() {
        return {
            viteIcon:'https://camo.githubusercontent.com/61e102d7c605ff91efedb9d7e47c1c4a07cef59d3e1da202fd74f4772122ca4e/68747470733a2f2f766974656a732e6465762f6c6f676f2e737667'
        }
    },
  //component code
  components: {
    FormWizard,
    TabContent,
  },
  computed:{
    nuxtIcon(){
        return `<img  src='https://nuxtjs.org/design-kit/colored-logo.svg' width='35px' />`
    }
  },
  methods: {
    onComplete() {
      alert("Yay. Done!");
    },
  },
};
</script>

<template>
    <FormWizard @on-complete="onComplete" lazy="true" color="#dd9c1d">
      <TabContent 
      title="Personal details" 
      :customIcon="`<img  src='${viteIcon}' width='35px' />`" >
      </TabContent>
      <TabContent
      title="Additional Info"  
      :customIcon="`<img  src='${viteIcon}' width='35px' />`" > 
        add your dynamic source
        <div>hjhjjjhhjhjhjhjhjhjhjhjhjhjjhj</div>
      </TabContent>
      <TabContent title="Last step" :customIcon="nuxtIcon">
        <div>hjhjjjhhjhjhjhjhjhjhjhjhjhjjhj</div>
        create tag in computed
      </TabContent>
    </FormWizard>
  </template>
  

  
  