<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileMenu'
})
</script>

<script setup lang="ts">
import AppMenu from '@/components/app/AppMenu.vue'
import MenuItem from '@/components/menu/MenuItem.vue'
import MenuOption from '@/components/menu/MenuOption.vue'

import { defineEmits, defineProps, ref } from 'vue'

const props = defineProps<{
  positions: { x: number; y: number }

  isMenuOpen: boolean
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void
  (event: 'openBoardModal'): void
}>()

const activeOption = ref(0)
</script>

<template>
  <AppMenu v-if="props.isMenuOpen" @closeMenu="emit('closeMenu')" :positions="props.positions">
    <div class="p-2">
      <MenuOption>
        <template #title>
          <span class="text-xs pb-1">Create</span>
        </template>

        <ul class="w-[10.5rem]" id="content" @click="emit('closeMenu')">
          <router-link :to="{ name: 'create' }">
            <MenuItem :id="0" :activeOption="activeOption" @enter="activeOption = 0">
              Pin
            </MenuItem>
          </router-link>

          <MenuItem
            :id="1"
            :activeOption="activeOption"
            @enter="activeOption = 1"
            @click="emit('openBoardModal')"
          >
            Board
          </MenuItem>
        </ul>
      </MenuOption>
    </div>
  </AppMenu>
</template>
