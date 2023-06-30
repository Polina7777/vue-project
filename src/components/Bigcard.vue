<script lang="ts">
export default {
    async mounted() {
      this.getCard(this.$route.params.id)
    },
  props: ['cardId'],
data() {
  return {
    id: this.cardId,
    info: null
  };
},
methods:{
    getCard(id: string | string[]) {
    fetch('https://jsonplaceholder.typicode.com/photos/'+ id)
      .then(response => response.json())
      .then(data => (this.info = data));
    }
},

}

</script>

<template>
<div class="card">
 <p>{{info?.id}}</p>
    <h1 class="title"> {{info?.title}}</h1>
    <img :src="info?.url" class="image"/>
    </div>

</template>