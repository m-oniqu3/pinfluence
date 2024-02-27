<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import PinGrid from '@/components/pins/PinGrid.vue'

import SavedPinPreview from '@/components/pins/SavedPinPreview.vue'
import { getSavedPinsForBoard } from '@/services/pinServices'
import { useAuthStore } from '@/stores/auth'

import { useInfiniteQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { computed, watch } from 'vue'

const props = defineProps<{
  userID: string
  boardID: number
}>()

const { data, isLoading, isError, error, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
  queryKey: ['boardPins', props.userID, props.boardID],
  queryFn: ({ pageParam }) => fetchPinsForCurrentBoard(pageParam, props.userID, props.boardID),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => {
    const nextPage: number | undefined = Object.keys(lastPage).length ? allPages.length : undefined
    return nextPage
  }
})

const authStore = useAuthStore()

const isOwner = computed(() => {
  return authStore.user?.id === props.userID
})

const flattenedPins = computed(() => {
  return data?.value?.pages.flatMap((page) => page.pins) ?? []
})

async function fetchPinsForCurrentBoard(pageParam: number, userID: string, boardID: number) {
  try {
    const response = await getSavedPinsForBoard(userID, boardID, pageParam)
    return response
  } catch (error: any) {
    let message = ''
    if (isAxiosError(error)) {
      message = error.response?.data ?? error.message
    } else {
      message = error.message
    }
    throw new Error('Failed to get pins. ' + message)
  }
}

// refetch when the boardID or userID changes
watch([() => props.boardID, () => props.userID], () => {
  refetch()
})

function refetching() {
  console.log('refetching')

  refetch()
}
</script>

<template>
  <p v-if="isLoading" class="text-center">Loading...</p>

  <p v-if="isError" class="text-center">Error: {{ error }}</p>
  <p v-else-if="!flattenedPins.length && !isLoading" class="text-center">No pins saved to this board</p>

  <section v-else-if="flattenedPins.length">
    <h1 v-if="isOwner" class="text-2xl font-bold text-center">
      {{ data?.pages[0].count }} {{ data?.pages[0].count === 1 ? 'Pin' : 'Pins' }}
    </h1>

    <InfiniteScroll :isLoadingIntial="isLoading" :isLoadingMore="isFetchingNextPage" @load-more="fetchNextPage">
      <PinGrid class="wrapper py-12">
        <SavedPinPreview
          v-for="record in flattenedPins"
          :key="record.id"
          :savedPinID="record.id"
          :pin="record.pin"
          @refresh-board="refetching"
        />
      </PinGrid>
    </InfiniteScroll>
  </section>
</template>
