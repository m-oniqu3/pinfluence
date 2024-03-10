<script setup lang="ts">
import { useRouter } from 'vue-router'

import InfiniteScroll from '@/components/InfiniteScroll.vue'
import PinGrid from '@/components/pins/PinGrid.vue'
import PinPreview from '@/components/pins/PinPreview.vue'
import { getAllCreatedPins } from '@/services/pinServices'

import { useInfiniteQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import AppSpinner from '../app/AppSpinner.vue'

const router = useRouter()

const { data, isLoading, error, isError, fetchNextPage, refetch, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['allCreatedPins'],
  queryFn: ({ pageParam }) => fetchAllPins(pageParam),
  initialPageParam: 0,

  getNextPageParam: (lastPage, allPages) => {
    const nextPage: number | undefined = lastPage?.length ? allPages.length : undefined
    return nextPage
  }
})

async function fetchAllPins(pageParam: number) {
  try {
    const response = await getAllCreatedPins(pageParam)
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

// watch for changes in the route
router.afterEach(() => refetch())
</script>

<template>
  <article v-if="isLoading" class="wrapper flex flex-col items-center justify-center gap-4 h-52">
    <h2 class="font-semibold text-xl text-center">We're adding new ideas to your feed</h2>
    <AppSpinner />
  </article>

  <p v-else-if="!isLoading && isError" class="text-center w-full">{{ error?.message }}</p>

  <InfiniteScroll
    v-else-if="data?.pages"
    :isLoadingIntial="isLoading"
    :isLoadingMore="isFetchingNextPage"
    @load-more="fetchNextPage"
  >
    <PinGrid class="wrapper">
      <PinPreview
        v-for="pin in data.pages.flat()"
        :key="pin.id"
        :details="{
          id: pin.id,
          name: pin.name,
          image: pin.image
        }"
      />
    </PinGrid>
  </InfiniteScroll>

  <p v-if="!isLoading && !isError && !data?.pages.flat().length" class="text-center w-full">No pins found</p>
</template>
