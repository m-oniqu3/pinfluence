<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinGrid'
})
</script>

<script setup lang="ts"></script>

<template>
  <section class="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4">
    <!-- <section class="gap-2 columns-2 sm:columns-3 md:columns-3 lg:columns-4 xl:columns-5 sm:gap-4"> -->
    <slot></slot>
  </section>
</template>

<style scoped>
section {
  max-width: 1280px;
  margin: 1rem auto;
}
</style>
