<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PrivateHome'
})
</script>

<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import PhotoList from '@/components/PhotoList.vue'
import { usePexels } from '@/composables/usePexel'
import { ref } from 'vue'

import { onMounted } from 'vue'

const { fetchfirstBatchOfPhotos, loadMorePhotos, photos, isLoading } = usePexels()
const page = ref(2)

onMounted(() => {
  // Load initial photos
  fetchfirstBatchOfPhotos()
})
</script>

<template>
  <div class="wrapper">
    <InfiniteScroll :isLoading="isLoading" @load-more="loadMorePhotos(page++)">
      <PhotoList :photos="photos" />
    </InfiniteScroll>
  </div>
</template>
