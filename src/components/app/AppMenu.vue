<script lang="ts">
import { defineComponent, defineEmits, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'AppMenu'
})
</script>

<script setup lang="ts">
const props = defineProps<{
  positions: { x: number; y: number }
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void
}>()

const menuWidth = ref(0)
const pos = ref({ x: 0, y: 0 })

// get menu width to calculate position
onMounted(() => {
  const menu = document.getElementById('menu') as HTMLElement
  menuWidth.value = menu.clientWidth

  pos.value = {
    x: props.positions.x - menuWidth.value + 20,
    y: props.positions.y + 40
  }
})
</script>

<template>
  <Teleport to="body">
    <div id="app-menu" @click="emit('closeMenu')" class="fixed top-0 left-0 h-full w-full">
      <div
        class="absolute shadow-lg rounded-2xl pt-4 px-2 pb-1 border-[1px] border-neutral-200 bg-white"
        :style="`top: ${pos.y}px; left: ${pos.x}px`"
        id="menu"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
