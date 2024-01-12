<script lang="ts">
import { useCreatedPinsStore } from '@/stores/createdPins'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreatedPins'
})
</script>

<script setup lang="ts">
const createdPinsStore = useCreatedPinsStore()
</script>

<template>
  <section class="wrapper pt-8 pb-12">
    <ul class="columns-2 sm:columns-3 md:columns-3 lg:columns-4 xl:columns-5 gap-8">
      <li v-for="photo in createdPinsStore.sortedPins" :key="photo.id" class="break-inside-avoid">
        <img :src="photo.image_url" alt="pin image" class="rounded-2xl h-full w-full mb-8" />
      </li>
    </ul>
  </section>
</template>
