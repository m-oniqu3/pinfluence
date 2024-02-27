<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import BaseButton from '@/components/BaseButton.vue'
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import AppModal from '@/components/app/AppModal.vue'
import MassDeletePins from '@/components/pins/MassDeletePins.vue'
import PinGrid from '@/components/pins/PinGrid.vue'
import { getSavedPinsForBoard } from '@/services/pinServices'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'

const { params } = router.currentRoute.value
const { profile, boardID } = params as { profile: string; boardID: string }

const { data, isLoading, isError, error, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
  queryKey: ['boardPins', profile, boardID],
  queryFn: ({ pageParam }) => fetchPinsForCurrentBoard(pageParam, profile, +boardID),
  initialPageParam: 0,

  getNextPageParam: (lastPage, allPages) => {
    const nextPage: number | undefined = Object.keys(lastPage).length ? allPages.length : undefined
    return nextPage
  }
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

const flattenedPins = computed(() => {
  return data?.value?.pages.flatMap((page) => page.pins) ?? []
})

// use set for O(1) lookups instead of array for O(n)
const selectedPins = ref(new Set<number>())
const isDeleteModalOpen = ref(false)

const toggleDeleteModal = (val: boolean) => {
  isDeleteModalOpen.value = val
}

function selectPin(id: number) {
  if (selectedPins.value.has(id)) {
    selectedPins.value.delete(id)
    return
  }
  selectedPins.value.add(id)
}

function selectAll() {
  selectedPins.value = new Set(flattenedPins.value.map((pin) => pin.id))
}

function deselectAll() {
  selectedPins.value.clear()
}

const selectedPinsCount = computed(() => {
  return selectedPins.value.size ? `${selectedPins.value.size} selected` : 'Select Pins to start'
})

// refetch when the boardID or userID changes
watch([() => boardID, () => profile], () => {
  refetch()
})

async function refreshBoard() {
  deselectAll()
  await refetch()

  toggleDeleteModal(false)
}
</script>
<template>
  <div class="wrapper relative">
    <header>
      <div class="relative mb-4">
        <span
          @click="router.back()"
          class="cursor-pointer absolute -top-1 -left-0 rounded-full w-12 h-12 grid place-items-center hover:bg-neutral-100"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="fa-lg" />
        </span>

        <h1 class="text-3xl font-bold text-center w-full">Select Pins</h1>
      </div>

      <div class="flex justify-between items-center">
        <p>
          {{ selectedPinsCount }}
        </p>

        <BaseButton
          v-if="selectedPins.size"
          :disabled="!selectedPins.size"
          class="bg-neutral-200"
          @click="deselectAll"
          :class="'disabled:opacity-50'"
        >
          Deselect All</BaseButton
        >

        <BaseButton
          v-if="!selectedPins.size"
          :disabled="selectedPins.size"
          class="bg-neutral-200"
          @click="selectAll"
          :class="'disabled:opacity-50'"
        >
          Select All
        </BaseButton>
      </div>
    </header>
    <p v-if="isLoading" class="text-center">Loading...</p>
    <p v-if="isError" class="text-center">Error: {{ error }}</p>

    <p v-else-if="!flattenedPins.length && !isLoading" class="text-center">No pins saved to this board</p>

    <section v-else-if="flattenedPins.length">
      <InfiniteScroll :isLoadingIntial="isLoading" :isLoadingMore="isFetchingNextPage" @load-more="fetchNextPage">
        <PinGrid class="wrapper py-12">
          <figure
            v-for="record in flattenedPins"
            :key="record.id"
            class="rounded-3xl p-1 cursor-pointer border-4"
            :class="selectedPins.has(record.id) ? 'border-4 border-black' : 'border-transparent'"
          >
            <img
              :src="record.pin.image"
              :alt="record.pin.name"
              class="rounded-2xl h-full w-full object-cover"
              @click="selectPin(record.id)"
            />
          </figure>
        </PinGrid>
      </InfiniteScroll>
    </section>

    <section v-if="flattenedPins" class="fixed bottom-8 w-full flex justify-center items-center gap-4 z-50">
      <button
        class="bg-white rounded-full w-16 h-16 grid place-items-center shadow-lg border-gray-100 border-[1px] disabled:opacity-70"
        :disabled="!selectedPins.size"
      >
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-gray-800 fa-xl" />
      </button>
      <button
        @click="toggleDeleteModal(true)"
        class="bg-white rounded-full w-16 h-16 grid place-items-center shadow-lg border-gray-100 border-[1px] disabled:opacity-70"
        :disabled="!selectedPins.size"
      >
        <font-awesome-icon :icon="['fas', 'trash']" class="text-gray-800 fa-xl" />
      </button>
    </section>
  </div>

  <AppModal :open="isDeleteModalOpen" @close-modal="toggleDeleteModal(false)">
    <MassDeletePins
      :selectedPins="selectedPins"
      @close-modal="toggleDeleteModal(false)"
      @refresh-board="refreshBoard"
    />
    >
  </AppModal>
</template>

<style scoped>
figure {
  min-height: 300px;
  height: 400px;
}

img {
  min-height: 300px;
}
</style>
