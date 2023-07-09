
<script setup lang="ts">

</script>

<template>
  <div class="welcome_wrapper">
<p class="description_welcome" >Rick and Morty is an American adult animated science fiction sitcom created by Justin Roiland and Dan Harmon for Cartoon Network's nighttime programming block Adult Swim. The series follows the misadventures of Rick Sanchez, a cynical mad scientist, and his good-hearted but fretful grandson Morty Smith, who split their time between domestic life and interdimensional adventures that take place across an infinite number of realities, often traveling to other planets and dimensions through portals and on Rick's flying saucer. The general concept of Rick and Morty relies on two conflicting scenarios: domestic family drama, and a misanthropic grandfather dragging his grandson into hijinks.</p>
</div>
</template>
<style >

.description_welcome {
  padding: 40px;
  font-size: 2rem;
  color:var(--color-heading);


}
  .welcome_wrapper {
    display: flex;
   justify-content: center;
   align-items: center;
   text-align: center;
   height: 100%;
   background-color: var(--background-genera);
  }
  @media (max-width: 1024px) {

    .description{
  font-size: 1.7rem;
}
@media (max-width: 650px) {

.description{
font-size: 1.4rem;
}
}
@media (max-width: 470px) {

.description{
font-size: 1.2rem;
}
}
@media (max-width: 360px) {

.description{
font-size: 1rem;
}
}
}
</style>