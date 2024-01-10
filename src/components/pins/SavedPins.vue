<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SavedPins'
})
</script>

<script setup lang="ts">
import { useBoardStore } from '@/stores/board'

const userBoards = useBoardStore()
</script>

<template>
  <ul>
    <h2>Boards</h2>
    <li v-for="board in userBoards.boards" :key="board.id">
      {{ board.name }}
    </li>
  </ul>
</template>
