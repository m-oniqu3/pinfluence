<script lang="ts">
import { defineComponent } from 'vue'

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

async function fetchBoards() {
  try {
    isLoading.value = true
    const response = await getBoards('created_at', 'desc')

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
</script>

<template>
  <section>
    <p v-if="isLoading" class="text-center">Loading...</p>

    <article
      v-else-if="boards.length"
      class="grid grid-cols-1 gap-y-6 gap-x-9 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <Suspense>
        <PreviewGrid v-for="board in boards" :key="board.id" :board="board" />

        <template #fallback> Loading boards... </template>
      </Suspense>
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
