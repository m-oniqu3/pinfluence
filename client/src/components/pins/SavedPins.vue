<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SavedPins'
})
</script>

<script setup lang="ts">
import CreateBoard from '@/components/CreateBoard.vue'
import PreviewGrid from '@/components/PreviewGrid.vue'
import AppModal from '@/components/app/AppModal.vue'
import { useBoardStore } from '@/stores/board'
import { ref } from 'vue'

const userBoards = useBoardStore()
const isBoardModalOpen = ref(false)

const openBoardModal = () => (isBoardModalOpen.value = true)
const closeBoardModal = () => (isBoardModalOpen.value = false)
</script>

<template>
  <section>
    <article
      v-if="!userBoards.boards.size"
      class="pt-4 w-full flex flex-col justify-start items-center gap-4 max-w-xs mx-auto"
    >
      <div class="text-center space-y-2">
        <h1 class="font-bold text-3xl">You don't have any boards yet.</h1>
        <p>Create one to save your pins!</p>
      </div>

      <div class="h-12 w-12 rounded-full bg-primary grid place-items-center cursor-pointer" @click="openBoardModal">
        <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-white" />
      </div>
    </article>

    <article v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <PreviewGrid v-for="board in Array.from(userBoards.boards.values())" :key="board.id" :board="board">
      </PreviewGrid>
    </article>

    <AppModal @close-modal="closeBoardModal" :open="isBoardModalOpen">
      <CreateBoard @close-modal="closeBoardModal" />
    </AppModal>
  </section>
</template>
