<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoList'
})
</script>

<script setup lang="ts">
import PhotoPin from '@/components/PhotoPin.vue'
import { type PexelsPhoto } from '@/composables/usePexel'
import { defineProps } from 'vue'

const props = defineProps<{
  photos: PexelsPhoto[]
}>()
</script>

<template>
  <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    <li v-for="photo in props.photos" :key="photo.id" class="break-inside-avoid">
      <PhotoPin :photo="photo" />
    </li>
  </ul>
</template>

<style scoped>
ul {
  max-width: 1280px;
  margin: 1rem auto;
}
</style>
