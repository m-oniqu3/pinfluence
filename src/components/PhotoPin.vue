<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoPin'
})
</script>

<script setup lang="ts">
import type { PexelsPhoto } from '@/types/pexels'
import { defineProps } from 'vue'
const props = defineProps<{
  photo: PexelsPhoto
}>()

function loadImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.classList.add('lazyloaded')
}
</script>

<template>
  <router-link :to="{ name: 'pin-details', params: { id: props.photo.id } }">
    <img
      :src="props.photo.src.original"
      :alt="props.photo.alt"
      class="rounded-2xl h-full w-full mb-8 object-cover"
      :style="{ backgroundColor: photo.avg_color, minHeight: '300px' }"
      @load="loadImage"
    />
  </router-link>
</template>

<style scoped>
.lazyload {
  opacity: 50%;
  transition: opacity 0.3s ease-in-out;
}

.lazyloaded {
  opacity: 1;
}
</style>
