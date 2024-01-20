<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PrivateHome'
})
</script>

<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import PinGrid from '@/components/pins/PinGrid.vue'
import PinPreview from '@/components/pins/PinPreview.vue'

import { useFeedStore } from '@/stores/feed'

import { onMounted } from 'vue'

const feed = useFeedStore()

onMounted(() => {
  // Load initial photos

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
</template>
