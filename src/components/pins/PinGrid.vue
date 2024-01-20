<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinGrid'
})
</script>

<script setup lang="ts"></script>

<template>
  <section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
    <slot></slot>
  </section>
</template>

<style scoped>
section {
  max-width: 1280px;
  margin: 1rem auto;
}
</style>
