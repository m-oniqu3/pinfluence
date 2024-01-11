<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoList'
})
</script>

<script setup lang="ts">
import { type PexelsPhoto } from '@/composables/usePexel'

// const { fetchPhotos, photos, isLoading } = usePexels()

// const observerElement = ref<HTMLDivElement | null>(null)
// const page = ref(1)

const props = defineProps<{
  photos: PexelsPhoto[]
}>()
</script>

<template>
  <ul class="column-2 sm:columns-3 md:columns-3 lg:columns-4 xl:columns-5 gap-8">
    <li v-for="photo in props.photos" :key="photo.id" class="break-inside-avoid">
      <img
        :src="photo.src.original"
        alt="photo.alt"
        class="rounded-2xl h-auto w-full mx-auto mb-8"
      />
    </li>
  </ul>
</template>

<style scoped>
ul {
  max-width: 1280px;
  margin: 1rem auto;
}
</style>
