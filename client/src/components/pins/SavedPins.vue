<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import PreviewGrid from '@/components/PreviewGrid.vue'
import AppModal from '@/components/app/AppModal.vue'
import CreateBoard from '@/components/boards/CreateBoard.vue'
import { getBoards } from '@/services/boardServices'
import { useAuthStore } from '@/stores/auth'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { params } = router.currentRoute.value
const id = ref(params.profile as string)
console.log(id.value)

const authStore = useAuthStore()

const isBoardModalOpen = ref(false)
const openBoardModal = () => (isBoardModalOpen.value = true)
const closeBoardModal = () => (isBoardModalOpen.value = false)

const isOwner = computed(() => {
  return authStore.user?.id === id.value
})

const {
  data: boards,
  isLoading,
  error,
  isError,
  fetchNextPage,
  refetch,
  isFetchingNextPage
} = useInfiniteQuery({
  queryKey: ['userBoards', id.value],
  queryFn: ({ pageParam }) => fetchBoards(pageParam, id.value),
  initialPageParam: 0,

  getNextPageParam: (lastPage, allPages) => {
    const nextPage: number | undefined = lastPage?.length ? allPages.length : undefined
    return nextPage
  }
})

async function fetchBoards(pageParam: number, profile: string) {
  try {
    const response = await getBoards('created_at', 'desc', profile, pageParam)
    return response
  } catch (error: any) {
    let message = ''

    if (isAxiosError(error)) {
      message = error.response?.data ?? error.message
    } else {
      message = error.message
    }

    throw new Error('Failed to get boards. ' + message)
  }
}

// watch for changes in the route
watch(
  () => router.currentRoute.value.params.profile,
  async (newProfile) => {
    id.value = newProfile as string
    await refetch()
  }
)
</script>

<template>
  <section class="wrapper pb-8">
    <p v-if="isLoading" class="text-center">Loading...</p>
    <p v-else-if="isError && error" class="text-center">{{ error.message }}</p>

    <InfiniteScroll
      v-else-if="boards?.pages"
      :isLoadingIntial="isLoading"
      :isLoadingMore="isFetchingNextPage"
      @load-more="fetchNextPage"
    >
      <article id="saved-pins">
        <PreviewGrid v-for="board in boards.pages.flat()" :key="board.id" :board="board" @refresh-boards="refetch" />
      </article>
    </InfiniteScroll>

    <article
      v-if="!boards?.pages.flat().length && !isLoading"
      class="pt-4 w-full flex flex-col justify-start items-center gap-4 max-w-xs mx-auto"
    >
      <template v-if="isOwner">
        <div class="text-center space-y-2">
          <h1 class="font-bold text-3xl">You don't have any boards yet.</h1>
          <p>Create one to save your pins!</p>
        </div>

        <div class="h-12 w-12 rounded-full bg-primary grid place-items-center cursor-pointer" @click="openBoardModal">
          <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-white" />
        </div>
      </template>

      <template v-else>
        <div class="text-center space-y-2">
          <h1 class="font-bold text-3xl">This user doesn't have any boards yet.</h1>
          <p>Check back later!</p>
        </div>
      </template>
    </article>

    <AppModal @close-modal="closeBoardModal" :open="isBoardModalOpen">
      <CreateBoard @close-modal="closeBoardModal" />
    </AppModal>
  </section>
</template>

<style scoped>
#saved-pins {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
  column-gap: 1rem;
  row-gap: 1.5rem;
  margin: 0 auto;
}

@media (max-width: 768px) {
  #saved-pins {
    max-width: 500px;
  }
}

@media (max-width: 1024px) {
  #saved-pins {
    max-width: 750px;
  }
}

@media (max-width: 1200px) {
  #saved-pins {
    max-width: 1000px;
  }
}

@media (min-width: 1201px) {
  #saved-pins {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    max-width: 1200px;
    column-gap: 1.5rem;
  }
}
</style>
