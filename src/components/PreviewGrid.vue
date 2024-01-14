<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PreviewGrid'
})
</script>

<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import type { Board } from '@/types/board'
import { defineProps, onMounted, ref, type Ref } from 'vue'

const props = defineProps<{
  boardId: string
}>()

const boardStore = useBoardStore()
const currentBoard: Ref<Board | null> = ref(null)

function getBoardDetails(id: string) {
  const boards = boardStore.boards
  if (!boards) return
  const result = boards.find((board) => board.id === props.boardId)
  if (!result) return

  currentBoard.value = result

  // fetch board details from API
}

onMounted(() => {
  getBoardDetails(props.boardId)
})

// will be 3 images
const images = ref<string[]>([
  //   'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
  //   'https://images.pexels.com/photos/235721/pexels-photo-235721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  //   'https://images.pexels.com/photos/2275221/pexels-photo-2275221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
])
</script>

<template>
  <figure class="rounded-2xl bg-white">
    <div id="preview-grid-1" class="rounded-tl-2xl rounded-bl-2xl bg-neutral-200">
      <span v-if="!images[0]" class="bg-red-300 h-6" />
      <img
        v-else
        :src="images[0]"
        alt=""
        class="rounded-tl-2xl rounded-bl-2xl h-full w-full object-cover"
      />
    </div>

    <div id="preview-grid-2" class="rounded-tr-2xl bg-neutral-200">
      <span v-if="!images[1]" class="h-full" />
      <img v-else :src="images[1]" alt="" class="rounded-tr-2xl h-full w-full object-cover" />
    </div>

    <div id="preview-grid-3" class="rounded-br-2xl bg-neutral-200">
      <span v-if="!images[2]" class="bg-red-300 h-6" />
      <img v-else :src="images[2]" alt="" class="rounded-br-2xl h-full w-full object-cover" />
    </div>
  </figure>

  <h1>
    {{ currentBoard?.name }}
  </h1>
</template>

<style scoped>
figure {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1px;
  width: 15rem;
  height: 10rem;
}

#preview-grid-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}

#preview-grid-2 {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}

#preview-grid-3 {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}
</style>
