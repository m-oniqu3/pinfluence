<script setup lang="ts">
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import PreviewGrid from '@/components/PreviewGrid.vue'
import AppModal from '@/components/app/AppModal.vue'
import CreateBoard from '@/components/boards/CreateBoard.vue'
import ProfileMenu from '@/components/profile/ProfileMenu.vue'
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

const isMenuOpen = ref(false)
const openMenu = () => (isMenuOpen.value = true)
const closeMenu = () => (isMenuOpen.value = false)
const positions = ref({ x: 0, y: 0 })

function getPosition(event: MouseEvent) {
  // Get mouse coordinates
  const { clientX, clientY } = event
  positions.value = { x: clientX, y: clientY }
}
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

    <template v-else-if="boards?.pages">
      <div class="h-16">
        <ul class="h-16 flex justify-between items-center">
          <li class="w-12 h-12 grid place-items-center hover:bg-neutral-100 hover:rounded-full cursor-pointer">
            <font-awesome-icon icon="fa-solid fa-sliders" class="fa-lg" />
          </li>
          <li
            class="w-12 h-12 grid place-items-center hover:bg-neutral-100 hover:rounded-full cursor-pointer"
            :class="isMenuOpen ? 'bg-black rounded-full' : ''"
            @click="openMenu"
            @click.prevent="getPosition"
          >
            <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg" :class="isMenuOpen ? 'text-white' : ''" />
          </li>
        </ul>
      </div>

      <InfiniteScroll :isLoadingIntial="isLoading" :isLoadingMore="isFetchingNextPage" @load-more="fetchNextPage">
        <article id="saved-pins">
          <PreviewGrid v-for="board in boards.pages.flat()" :key="board.id" :board="board" @refresh-boards="refetch" />
        </article>
      </InfiniteScroll>
    </template>

    <article
      v-if="!boards?.pages.flat().length && !isLoading"
      class="w-full flex flex-col justify-start items-center gap-4 max-w-xs mx-auto"
    >
      <template v-if="isOwner">
        <p class="text-center max-w-sm mx-auto">You don't have any boards yet. Create one to save your pins to!</p>

        <div class="h-12 w-12 rounded-full bg-primary grid place-items-center cursor-pointer" @click="openBoardModal">
          <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-white" />
        </div>
      </template>

      <template v-else>
        <p class="max-w-sm mx-auto text-center">This user doesn't have any boards yet. Check back later!</p>
      </template>
    </article>

    <ProfileMenu
      :positions="positions"
      :isMenuOpen="isMenuOpen"
      @closeMenu="closeMenu"
      @open-board-modal="openBoardModal"
    />

    <AppModal @close-modal="closeBoardModal" :open="isBoardModalOpen">
      <CreateBoard @close-modal="closeBoardModal" @refresh-boards="refetch" />
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
