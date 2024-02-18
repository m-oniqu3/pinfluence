<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SavedPins'
})
</script>

<script setup lang="ts">
import PreviewGrid from '@/components/PreviewGrid.vue'
import AppModal from '@/components/app/AppModal.vue'
import CreateBoard from '@/components/boards/CreateBoard.vue'
import { getBoards } from '@/services/boardServices'
import type { Board } from '@/types/board'
import { isAxiosError } from 'axios'
import { onMounted, ref } from 'vue'

const isBoardModalOpen = ref(false)

const openBoardModal = () => (isBoardModalOpen.value = true)
const closeBoardModal = () => (isBoardModalOpen.value = false)
const boards = ref<Board[]>([])
const originalBoards = ref<Board[]>([])
const isLoading = ref(false)
const router = useRouter()

async function fetchBoards() {
  try {
    isLoading.value = true

    const { params } = router.currentRoute.value

    if (!params.profile) {
      return
    }

    const id = params.profile as string

    console.log('fetching boards for user with id: ', id)
    const response = await getBoards('created_at', 'desc', id)

    boards.value = response
    originalBoards.value = response
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchBoards)

// watch for changes in the route
router.afterEach(fetchBoards)
</script>

<template>
  <section class="wrapper pb-8">
    <p v-if="isLoading" class="text-center">Loading...</p>

    <article v-else-if="boards.length" id="saved-pins">
      <PreviewGrid v-for="board in boards" :key="board.id" :board="board" @refresh-boards="fetchBoards" />
    </article>

    <article v-else class="pt-4 w-full flex flex-col justify-start items-center gap-4 max-w-xs mx-auto">
      <div class="text-center space-y-2">
        <h1 class="font-bold text-3xl">You don't have any boards yet.</h1>
        <p>Create one to save your pins!</p>
      </div>

      <div class="h-12 w-12 rounded-full bg-primary grid place-items-center cursor-pointer" @click="openBoardModal">
        <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-white" />
      </div>
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

@media (min-width: 1440px) {
  #saved-pins {
    max-width: 1250px;
    column-gap: 2rem;
  }
}
</style>
