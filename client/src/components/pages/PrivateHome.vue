<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PrivateHome'
})
</script>

<script setup lang="ts">
// const feed = useFeedStore()

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// onMounted(() => {
//   if (auth.user?.id && !feed.pins.length) {
//     console.log('fetching pins')

//     feed.getInitialPins()
//   }
// })
</script>

<template>
  <p>Private Home, {{ authStore.user?.id }}</p>
</template>

<!-- <template>
  <div class="wrapper">
    <InfiniteScroll
      :isLoadingIntial="feed.isLoadingInitial"
      :isLoadingMore="feed.isLoadingMore"
      @load-more="feed.loadMorePins"
    >
      <p v-if="feed.isLoadingInitial" class="text-center">Loading...</p>
      <PinGrid v-else>
        <PinPreview
          v-for="pin in feed.pins"
          :key="pin.id"
          :details="{
            id: pin.id,
            name: pin.name,
            image: pin.image,
            board_id: pin.board_id
          }"
        />
      </PinGrid>
    </InfiniteScroll>
  </div>
</template> -->
