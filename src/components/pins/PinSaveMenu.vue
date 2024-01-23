<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinSaveMenu'
})
</script>

<script setup lang="ts">
import AppMenu from '@/components/app/AppMenu.vue'
import BoardOption from '@/components/boards/BoardOption.vue'
import BoardSearch from '@/components/boards/BoardSearch.vue'
import { useBoardStore } from '@/stores/board'
import type { Board } from '@/types/board'
import { defineEmits, ref, type Ref } from 'vue'

const props = defineProps<{
  isMenuOpen: boolean
  positions: { x: number; y: number }
  menuDimensions: { width: number; height: number }
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void
  (event: 'setMenuDemensions', dimensions: { width: number; height: number }): void
}>()

const boardStore = useBoardStore()

const menuStyle = {
  width: props.menuDimensions.width + 'px',
  height: props.menuDimensions.height + 'px'
}

const searchInput = ref('')
const searchResults: Ref<Board[]> = ref([])

function getSearchResults() {
  if (searchInput.value) {
    searchResults.value = boardStore.searchBoard(searchInput.value)
  }
}
</script>

<template>
  <div>
    <AppMenu :positions="props.positions" v-if="props.isMenuOpen" @close-menu="emit('closeMenu')">
      <section id="section" @click.stop :style="menuStyle">
        <h1 class="h-16 w-full grid place-items-center font-semibold">Save</h1>

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
              @close-menu="emit('closeMenu')"
            />
          </template>

          <template v-else>
            <template v-if="boardStore.recentBoards.length && !searchInput">
              <li class="text-xs py-2 px-2">Top Choices</li>

              <BoardOption
                v-for="board in boardStore.recentBoards"
                :key="board.id"
                :board="board"
                @close-menu="emit('closeMenu')"
              />
            </template>

            <li class="text-xs py-2 px-2">All Boards</li>

            <BoardOption
              v-for="board in boardStore.boardList"
              :key="board.id"
              :board="board"
              @close-menu="emit('closeMenu')"
            />
          </template>
        </ul>

        <div
          class="flex items-center gap-4 px-4 rounded-b-lg cursor hover:bg-neutral-200 border-t-[1px] border-slate-200"
        >
          <div class="h-12 w-12 rounded-lg bg-neutral-200 grid place-items-center">
            <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-black" />
          </div>

          <h1 class="text-base font-semibold">Create Board</h1>
        </div>
      </section>
    </AppMenu>
  </div>
</template>

<style scope>
#section {
  display: grid;
  grid-template-rows: 64px 64px 1fr 80px;
}
</style>
