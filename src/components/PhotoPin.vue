<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoPin'
})
</script>

<script setup lang="ts">
import type { PexelsPhoto } from '@/composables/usePexel'
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
  <img
    :src="props.photo.src.original"
    :alt="props.photo.alt"
    class="rounded-2xl h-full w-full mb-8 object-cover"
    :style="{ backgroundColor: photo.avg_color, minHeight: '300px' }"
    @load="loadImage"
  />
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
