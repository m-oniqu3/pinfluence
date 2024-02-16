<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TagsList'
})
</script>

<script setup lang="ts">
import AppMenu from '@/components/app/AppMenu.vue'
import type { Tag } from '@/types/tag'
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  isMenuOpen: boolean
  positions: { x: number; y: number }
  tagsList: Tag[]
  isLoadingTags: boolean
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void
  (event: 'addTag', tag: Tag): void
}>()
</script>

<template>
  <AppMenu :positions="props.positions" v-if="props.isMenuOpen" @close-menu="emit('closeMenu')">
    <ul class="w-[400px] py-2 h-[200px] overflow-y-auto">
      <li class="px-4 py-2 text-sm">Matched Tags ({{ tagsList.length }})</li>
      <li v-if="props.isLoadingTags" class="px-4 py-1">Loading...</li>
      <template v-else>
        <li
          v-for="tag in tagsList"
          :key="tag.id"
          class="px-4 py-1 truncate font-bold hover:bg-neutral-200"
          @click="emit('addTag', tag)"
        >
          {{ tag.name }}
        </li></template
      >
    </ul>
  </AppMenu>
</template>
