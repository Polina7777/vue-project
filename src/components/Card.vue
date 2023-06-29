<script>
export default {
      name: "get-request",
  data() {
    return {
      card: null
    };
  },
async created() {
    // Simple GET request using fetch
   await fetch(`https://jsonplaceholder.typicode.com/photos/1`)
      .then(response => response.json())
      .then(data => (this.card = data));
  },

};

</script>

<template>
<div class="card">
 <p>{{card.id}}</p>
    <h1 class="title"> {{card.title}}</h1>
    <img :src="card.url" class="image"/>
    </div>
</template>

