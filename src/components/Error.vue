<script lang="ts">

export default{
    props:['errorText']
}
</script>
<template>
    <div class="error_wrapper">
    <p class="error">{{errorText}}</p>
</div>
</template>
<style scoped>
.error{
    align-items: center;
    font-size: 50px;
    color:rgb(237, 237, 246);
}
.error_wrapper{
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>