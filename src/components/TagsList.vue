<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TagsList'
})
</script>

<script setup lang="ts">
import AppMenu from '@/components/app/AppMenu.vue'
import { defineEmits, defineProps, onMounted } from 'vue'

const props = defineProps<{
  isMenuOpen: boolean
  positions: { x: number; y: number }
  tagsList: { id: string; name: string }[]
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void
}>()

onMounted(() => {
  console.log(props.tagsList)
})
</script>

<template>
  <AppMenu :positions="props.positions" v-if="props.isMenuOpen" @close-menu="emit('closeMenu')">
    <ul class="w-[400px] py-2 h-[200px] overflow-y-auto">
      <h1 class="px-4 py-2 text-sm">Matched Tags ({{ tagsList.length }})</h1>
      <li
        v-for="tag in tagsList"
        :key="tag.id"
        class="px-4 py-1 truncate font-bold hover:bg-neutral-200"
      >
        {{ tag.name }}
      </li>
    </ul>
  </AppMenu>
</template>
