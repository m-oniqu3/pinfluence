<script setup lang="ts">
import { getCurrentUserBoards, getRecentBoards } from '@/services/boardServices'
import type { Board, BoardInfo } from '@/types/board'
import { useQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { computed, defineEmits, ref, watch } from 'vue'
import AppSpinner from '../app/AppSpinner.vue'
import BoardOption from '../boards/BoardOption.vue'
import BoardSearch from '../boards/BoardSearch.vue'

const emit = defineEmits<{
  (event: 'closeModal'): void
  (event: 'createBoard'): void
  (event: 'selectBoard', board: BoardInfo): void
}>()

const searchInput = ref('')

const { data, error, isError, isPending } = useQuery({
  queryKey: ['boards'],
  queryFn: fetchBoards,
  retry: false
})

const { data: recents, isLoading: recentsIsLoading } = useQuery({
  queryKey: ['recents'],
  queryFn: fetchRecents,
  retry: false
})

async function fetchRecents() {
  try {
    const response = await getRecentBoards()
    return response
  } catch (error) {
    let message = ''
    if (isAxiosError(error)) {
      message = error.response?.data ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    throw new Error('Failed to get recent boards. ' + message)
  }
}

async function fetchBoards() {
  try {
    const response = await getCurrentUserBoards('name', 'asc')

    return response
  } catch (error) {
    let message = ''
    if (isAxiosError(error)) {
      message = error.response?.data ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    throw new Error('Failed to get boards. ' + message)
  }
}

const isHeightSmall = computed(() => {
  return window.innerHeight < 500
})

const gridClass = computed(() => {
  return window.innerHeight >= 500 ? 'defaultGrid' : 'smallGrid'
})

const originalBoards = computed(() => data.value ?? [])

const boards = ref<Board[]>(data.value ?? [])

// when data changes, update the boards ref
watch(data, () => {
  boards.value = data.value ?? []
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
    <div v-if="isPending" class="grid place-items-center h-full w-full">
      <AppSpinner />
    </div>

    <p v-else-if="isError" class="grid place-items-center h-full w-full text-red-500">
      {{ error }}
    </p>

    <section v-else id="section" :class="gridClass" class="rounded-2xl">
      <h1 class="grid place-items-center h-full w-full font-semibold" v-show="!isHeightSmall">Save</h1>

      <BoardSearch v-model="searchInput" @input="getSearchResults()" @clear-search="clearSearch" />

      <ul class="px-3 py-4 overflow-scroll">
        <li v-if="!boards.length" class="text-gray-500">No boards found.</li>

        <li v-if="recentsIsLoading" class="text-gray-500">Loading...</li>

        <template v-if="recents && !searchInput">
          <li class="text-xs py-2 px-2">Top Choices</li>
          <BoardOption
            v-for="board in recents"
            :key="board.id"
            :board="board"
            @close-menu="emit('closeModal')"
            @select-board="selectBoard"
          />
        </template>

        <li v-if="boards" class="text-xs py-2 px-2">All Boards</li>

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
