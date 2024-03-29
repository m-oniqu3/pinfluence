<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import AppSpinner from '../app/AppSpinner.vue'

export default defineComponent({
  name: 'CreatedPins'
})
</script>

<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import PinGrid from '@/components/pins/PinGrid.vue'
import PinPreviewVue from '@/components/pins/PinPreview.vue'
import { getUserCreatedPins } from '@/services/pinServices'
import { useAuthStore } from '@/stores/auth'
import type { PinPreview } from '@/types/pin'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const { profile } = router.currentRoute.value.params as { profile: string }

const isOwnProfile = computed(() => {
  return authStore.user?.id === profile
})

const { data, isLoading, error, isError, fetchNextPage, refetch, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['createdPins', profile],
  queryFn: ({ pageParam }) => fetchPins(pageParam, profile),
  initialPageParam: 0,

  // if the last page has a length, then there are more pages
  getNextPageParam: (lastPage, allPages) => {
    const nextPage: number | undefined = lastPage?.length ? allPages.length : undefined
    return nextPage
  }
})

async function fetchPins(pageParam: number, profile: string) {
  try {
    const response = await getUserCreatedPins(profile, pageParam)
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
  <div v-if="isLoading" class="h-40 flex items-center justify-center w-full">
    <AppSpinner />
  </div>
  <p v-else-if="isError && error" class="text-center w-full">{{ error.message }}</p>

  <template v-else-if="!data?.pages.flat().length">
    <div v-if="isOwnProfile" class="pt-4 w-full max-w-sm mx-auto grid place-items-center gap-2">
      <p class="text-base">Nothing to show...yet! Pins you create will live here.</p>
      <router-link :to="{ name: 'create' }" class="btn bg-primary text-neutral w-fit font-bold">
        Create Pin
      </router-link>
    </div>
    <p v-else-if="!isOwnProfile" class="text-center w-full">This user has not created any pins yet.</p>
  </template>

  <InfiniteScroll
    v-else-if="data?.pages"
    :is-loading-intial="isLoading"
    :is-loading-more="isFetchingNextPage"
    @load-more="fetchNextPage"
  >
    <PinGrid class="wrapper">
      <PinPreviewVue
        v-for="pin in data?.pages.flat() as PinPreview[]"
        :key="pin.id"
        :details="{
          id: pin.id,
          image: pin.image,
          name: pin.name
        }"
        :allow-edit="isOwnProfile"
        @refresh-boards="refetch"
      />
    </PinGrid>
  </InfiniteScroll>

  <p v-else>No pins found</p>
</template>
