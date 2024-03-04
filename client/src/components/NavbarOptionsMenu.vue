<script setup lang="ts">
import AppMenu from '@/components/app/AppMenu.vue'
import MenuOption from '@/components/menu/MenuOption.vue'

const props = defineProps<{
  positions: { x: number; y: number }

  isMenuOpen: boolean
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void
}>()
</script>

<template>
  <AppMenu v-if="props.isMenuOpen" @closeMenu="emit('closeMenu')" :positions="props.positions">
    <div class="p-2">
      <MenuOption>
        <template #title>
          <span class="text-xs pb-1">Currently in</span>
        </template>
      </MenuOption>
    </div>
  </AppMenu>
</template>
