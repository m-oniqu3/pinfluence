<script setup lang="ts">
import BoardOption from '@/components/boards/BoardOption.vue'
import BoardSearch from '@/components/boards/BoardSearch.vue'
import { getCurrentUserBoards } from '@/services/boardServices'
import type { Board, BoardInfo } from '@/types/board'
import { isAxiosError } from 'axios'
import { computed, defineEmits, onMounted, ref } from 'vue'

const emit = defineEmits<{
  (event: 'closeModal'): void
  (event: 'createBoard'): void
  (event: 'selectBoard', board: BoardInfo): void
}>()

const boards = ref<Board[]>([])
const originalBoards = ref<Board[]>([])
const isLoading = ref(false)
const searchInput = ref('')

async function fetchBoards() {
  try {
    isLoading.value = true
    const response = await getCurrentUserBoards('name', 'asc')

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

const isHeightSmall = computed(() => {
  return window.innerHeight < 500
})

const gridClass = computed(() => {
  return window.innerHeight >= 500 ? 'defaultGrid' : 'smallGrid'
})

function getSearchResults() {
  const query = searchInput.value.toLowerCase().trim()
  if (!query) {
    boards.value = originalBoards.value
    return
  }

  boards.value = originalBoards.value.filter((board) => {
    return board.name.toLowerCase().includes(query)
  })
}

function clearSearch() {
  searchInput.value = ''
  boards.value = originalBoards.value
}

function selectBoard(board: BoardInfo) {
  emit('selectBoard', board)
}
</script>

<template>
  <div class="bg-white wrapper rounded-2xl" @click.stop id="section">
    <p v-if="isLoading" class="grid place-items-center h-full w-full">Loading...</p>

    <section v-else id="section" :class="gridClass" class="rounded-2xl">
      <h1 class="grid place-items-center h-full w-full font-semibold" v-show="!isHeightSmall">Save</h1>

      <BoardSearch v-model="searchInput" @input="getSearchResults()" @clear-search="clearSearch" />

      <ul class="px-3 py-4 overflow-scroll">
        <li v-if="!boards.length" class="text-gray-500">No boards found.</li>
        <li v-else class="text-xs py-2 px-2">All Boards</li>

        <BoardOption
          v-for="board in boards"
          :key="board.id"
          :board="board"
          @close-menu="emit('closeModal')"
          @select-board="selectBoard"
        />
      </ul>

      <div
        @click="emit('createBoard')"
        v-show="!isHeightSmall"
        class="flex items-center gap-4 px-4 rounded-b-lg cursor hover:bg-neutral-200 border-t-[1px] border-slate-200"
      >
        <div class="h-12 w-12 rounded-lg bg-neutral-200 grid place-items-center">
          <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-black" />
        </div>

        <h1 class="text-base font-semibold">Create Board</h1>
      </div>
    </section>
  </div>
</template>

<style scoped>
#section {
  display: grid;
  width: 360px;
}

.defaultGrid {
  grid-template-rows: 64px 64px 1fr 80px;
  height: 450px;
}

.smallGrid {
  grid-template-rows: 64px 1fr;
  max-height: 300px;
}
</style>
