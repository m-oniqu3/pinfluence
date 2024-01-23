<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BoardList'
})
</script>

<script setup lang="ts">
import AppMenu from '@/components/app/AppMenu.vue'
import { useBoardStore } from '@/stores/board'

const props = defineProps<{
  isMenuOpen: boolean
  positions: { x: number; y: number }
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void

  (event: 'update:modelValue', value: { id: number; name: string }): void
}>()

function selectBoard(boardId: number, boardName: string) {
  emit('update:modelValue', { id: boardId, name: boardName })
  emit('closeMenu')
}

const boardStore = useBoardStore()
</script>

<template>
  <div>
    <AppMenu :positions="props.positions" v-if="props.isMenuOpen" @close-menu="emit('closeMenu')">
      <section class="py-3">
        <form class="relative w-full px-3 pb-3 bg-white z-10" @click.stop>
          <font-awesome-icon
            icon="fa-solid fa-magnifying-glass"
            class="text-gray-700 absolute top-4 left-6"
          />

          <input
            type="text"
            placeholder="Search boards"
            class="pl-8 p-3 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-200"
          />
        </form>

        <ul class="w-[400px] h-64 overflow-hidden overflow-y-scroll px-3">
          <template v-if="boardStore.boards">
            <li class="text-sm font-normal py-1">All Boards</li>

            <li
              v-for="board in boardStore.boardList"
              :key="board.id"
              class="p-2 w-full grid grid-cols-[auto,1fr] gap-4 hover:rounded-2xl hover:bg-neutral-200"
              @click.stop="selectBoard(board.id, board.name)"
            >
              <div class="h-9 w-9 bg-black rounded-lg" />
              <p class="truncate flex items-center font-medium text-base">
                {{ board.name }}
              </p>
            </li>
          </template>

          <li v-else class="text-sm font-normal py-1">No boards found</li>
        </ul>

        <div class="border-t-[1px] border-slate-300 grid grid-cols-[auto,1fr] gap-4 py-3 px-4">
          <span class="h-7 w-7 grid place-items-center bg-primary rounded-full">
            <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg text-neutral" />
          </span>
          <button class="w-full text-left text-base font-medium">Create board</button>
        </div>
      </section>
    </AppMenu>
  </div>
</template>
