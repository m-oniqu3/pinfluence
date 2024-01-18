<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PinPreview'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { useBoardStore } from '@/stores/board'
import { type PinPreview } from '@/types/pin'
import { defineProps, onMounted, ref } from 'vue'

const props = defineProps<{
  details: PinPreview
}>()
const boardStore = useBoardStore()
const boardName = ref('')

onMounted(() => {
  if (props.details.board_id) {
    boardName.value = boardStore.boardKeys ? boardStore.boardKeys[props.details.board_id] : ''
  }
})
</script>

<template>
  <router-link :to="{ name: 'pin-details', params: { id: props.details.id } }">
    <figure class="relative">
      <figcaption class="absolute flex justify-between items-center w-full p-4" v-if="boardName">
        <h1 class="text-white font-medium truncate">{{ boardName }}</h1>
        <BaseButton class="bg-primary text-white">Save</BaseButton>
      </figcaption>

      <img
        :src="props.details.url"
        :alt="props.details.title"
        class="rounded-2xl h-full w-full mb-8"
      />
    </figure>
  </router-link>
</template>
