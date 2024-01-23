<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'BoardOption'
})
</script>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { type Board } from '@/types/board'

const props = defineProps<{
  board: Board
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void
}>()

const isHovering = ref(false)

function savePin(event: Event) {
  console.log('saving pin')
  console.log(props.board.name)
  emit('closeMenu')
}
</script>

<template>
  <li
    class="relative p-2 w-full grid grid-cols-[auto,1fr,30px] gap-4 hover:rounded-2xl hover:bg-neutral-200 cursor-pointer"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- generate random image url -->
    <img
      class="h-12 w-12 bg-black rounded-lg"
      :src="`https://picsum.photos/seed/${props.board.id}/200`"
    />
    <p class="truncate flex items-center font-semibold text-base">{{ props.board.name }}</p>

    <font-awesome-icon :icon="['fas', 'lock']" v-show="board.secret" class="self-center" />
    <BaseButton
      class="bg-primary text-white absolute top-3 right-2"
      v-show="isHovering"
      @click.stop="savePin"
    >
      Save
    </BaseButton>
  </li>
</template>
