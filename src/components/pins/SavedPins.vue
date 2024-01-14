<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SavedPins'
})
</script>

<script setup lang="ts">
import PreviewGrid from '@/components/PreviewGrid.vue'
import { useBoardStore } from '@/stores/board'

const userBoards = useBoardStore()
</script>

<template>
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <li v-for="board in userBoards.boards" :key="board.id">
      <PreviewGrid :boardId="board.id.toString()" />
      {{ board.name }}
    </li>
  </ul>
</template>
