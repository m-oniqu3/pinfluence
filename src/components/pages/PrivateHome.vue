<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PrivateHome'
})
</script>

<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import PinPreview from '@/components/pins/PinPreview.vue'
// import PhotoList from '@/components/PhotoList.vue'
// import { usePexels } from '@/composables/usePexel'

import { useFeedStore } from '@/stores/feed'

import { onMounted } from 'vue'

// const { fetchfirstBatchOfPhotos, loadMorePhotos, photos, isLoading } = usePexels()
// const page = ref(2)
const feed = useFeedStore()

onMounted(() => {
  // Load initial photos
  // fetchfirstBatchOfPhotos()
  feed.getInitialPins()
})
</script>

<template>
  <div class="wrapper">
    <InfiniteScroll
      :isLoadingIntial="feed.isLoadingInitial"
      :isLoadingMore="feed.isLoadingMore"
      @load-more="feed.loadMorePins"
    >
      <p v-if="feed.isLoadingInitial" class="text-center">Loading...</p>
      <section v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <PinPreview
          :details="{
            id: pin.id,
            title: pin.name,
            url: pin.image,
            board_id: pin.board_id
          }"
          v-for="pin in feed.pins"
          :key="pin.id"
        />
      </section>
    </InfiniteScroll>

    <!-- <InfiniteScroll :isLoading="isLoading" @load-more="loadMorePhotos(page++)">
      <p v-if="isLoading" class="text-center">Loading...</p>
      <PhotoList v-else :photos="photos" />
    </InfiniteScroll> -->
  </div>
</template>

<style scoped>
section {
  max-width: 1280px;
  margin: 1rem auto;
}
</style>
