<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinSaveModal'
})
</script>

<script setup lang="ts">
import BoardOption from '@/components/boards/BoardOption.vue'
import BoardSearch from '@/components/boards/BoardSearch.vue'
import { useBoardStore } from '@/stores/board'
import type { Board } from '@/types/board'
import { computed, defineEmits, ref, type Ref } from 'vue'

const emit = defineEmits<{
  (event: 'closeModal'): void
}>()

const boardStore = useBoardStore()
const searchInput = ref('')

const searchResults: Ref<Board[]> = ref([])

function getSearchResults() {
  if (searchInput.value) {
    searchResults.value = boardStore.searchBoard(searchInput.value)
  }
}

const isHeightSmall = computed(() => {
  return window.innerHeight < 500
})

const gridClass = computed(() => {
  return window.innerHeight >= 500 ? 'defaultGrid' : 'smallGrid'
})
</script>

<template>
  <section class="bg-white wrapper rounded-lg" @click.stop id="section" :class="gridClass">
    <h1 class="relative grid place-items-center h-full w-full" v-show="!isHeightSmall">
      <span class="font-semibold text-lg"> Save </span>

      <font-awesome-icon
        icon="fa-solid fa-times"
        class="text-gray-700 absolute top-6 right-3 fa-lg cursor-pointer"
        @click="emit('closeModal')"
      />
    </h1>

    <BoardSearch v-model="searchInput" @input="getSearchResults()" />

    <ul class="px-3 py-4 overflow-scroll">
      <li v-if="boardStore.boardList.length === 0" class="text-gray-500">No boards found</li>

      <template v-if="searchInput">
        <li v-if="searchInput && searchResults.length === 0" class="text-gray-500">
          No boards found
        </li>

        <BoardOption
          v-for="board in searchResults"
          :key="board.id"
          :board="board"
          @close-menu="emit('closeModal')"
        />
      </template>

      <template v-else>
        <template v-if="boardStore.recentBoards.length && !searchInput">
          <li class="text-xs py-2 px-2">Top Choices</li>

          <BoardOption
            v-for="board in boardStore.recentBoards"
            :key="board.id"
            :board="board"
            @close-menu="emit('closeModal')"
          />
        </template>

        <li class="text-xs py-2 px-2">All Boards</li>

        <BoardOption
          v-for="board in boardStore.boardList"
          :key="board.id"
          :board="board"
          @close-menu="emit('closeModal')"
        />
      </template>
    </ul>

    <div
      v-show="!isHeightSmall"
      class="flex items-center gap-4 px-4 rounded-b-lg cursor hover:bg-neutral-200 border-t-[1px] border-slate-200"
    >
      <div class="h-12 w-12 rounded-lg bg-neutral-200 grid place-items-center">
        <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-black" />
      </div>

      <h1 class="text-base font-semibold">Create Board</h1>
    </div>
  </section>
</template>

<style scoped>
#section {
  display: grid;
  max-width: 400px;
}

.defaultGrid {
  grid-template-rows: 64px 64px 1fr 80px;
  max-height: 450px;
}

.smallGrid {
  grid-template-rows: 64px 1fr;
  max-height: 300px;
}
</style>
