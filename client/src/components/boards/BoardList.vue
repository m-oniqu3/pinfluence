<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BoardList'
})
</script>

<script setup lang="ts">
import BoardSearch from '@/components/boards/BoardSearch.vue'
import { getBoards } from '@/services/boardServices'
import type { Board } from '@/types/board'
import { isAxiosError } from 'axios'
import { onMounted, ref } from 'vue'

const emit = defineEmits<{
  (event: 'closeMenu'): void
  (event: 'update:modelValue', value: { id: number; name: string }): void
}>()

const isLoading = ref(false)

function selectBoard(boardId: number, boardName: string) {
  emit('update:modelValue', { id: boardId, name: boardName })
  emit('closeMenu')
}

const boards = ref<Board[]>([])
const originalBoards = ref<Board[]>([])
const searchInput = ref('')

async function getSearchResults() {
  const query = searchInput.value.toLowerCase()

  if (!query) {
    boards.value = originalBoards.value
  } else {
    boards.value = originalBoards.value.filter((board) => board.name.toLowerCase().includes(query))
  }
}

function clearSearch() {
  searchInput.value = ''
  boards.value = originalBoards.value
}

async function fetchBoards() {
  try {
    isLoading.value = true
    const response = await getBoards('name', 'asc')

    return response
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

async function initialize() {
  const response = await fetchBoards()
  if (response) {
    boards.value = response
    originalBoards.value = response
  }
}

onMounted(initialize)
</script>

<template>
  <section class="py-3 w-[400px] h-[325px]">
    <p v-if="isLoading">Loading...</p>

    <div v-else class="grid grid-rows-[4rem,auto,3rem] h-full">
      <BoardSearch v-model="searchInput" @input="getSearchResults()" @clearSearch="clearSearch" />

      <ul class="h-full overflow-hidden overflow-y-scroll p-3">
        <template v-if="!!boards.length">
          <li class="text-sm font-normal py-1">All Boards</li>

          <li
            v-for="board in boards"
            :key="board.id"
            class="p-2 w-full grid grid-cols-[auto,1fr] gap-4 hover:rounded-2xl hover:bg-neutral-200"
            @click.stop="selectBoard(board.id, board.name)"
          >
            <img src="https://picsum.photos/200" class="h-9 w-9 bg-neutral-100 rounded-lg" />
            <p class="truncate flex items-center font-medium text-base">
              {{ board.name }}
            </p>
          </li>
        </template>

        <li v-else class="text-sm font-normal py-1">No boards found</li>
      </ul>

      <button class="border-t-[1px] border-slate-300 grid grid-cols-[auto,1fr] gap-4 py-3 px-4">
        <span class="h-7 w-7 grid place-items-center bg-primary rounded-full">
          <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-neutral" />
        </span>
        <span class="w-full text-left text-base font-medium">Create board</span>
      </button>
    </div>
  </section>
</template>
