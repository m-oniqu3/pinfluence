<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(async () => {
  console.log('mounted')

  // await populateCreatedPins()
})
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>

    <img src="https://images.pexels.com/photos/19845906/pexels-photo-19845906.jpeg" alt="beach" />
  </div>
</template>

<style></style>
