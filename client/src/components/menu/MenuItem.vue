<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuItem'
})
</script>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'enter'): void
}>()

const props = defineProps<{
  activeOption: number
  id: number
}>()

const isActive = computed(() => {
  return props.activeOption === props.id ? 'bg-neutral-100' : ''
})
</script>

<template>
  <li class="px-2 py-[0.4rem] rounded-lg cursor-pointer" @mouseenter="emit('enter')" :class="isActive">
    <slot id="sl" />
  </li>
</template>

<style scoped>
li {
  transition: background-color 0.2s ease-in-out;
  list-style: none;
}
</style>
