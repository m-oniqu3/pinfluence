<script setup lang="ts">
import AppMenu from '@/components/app/AppMenu.vue'
import MenuItem from '@/components/menu/MenuItem.vue'
import MenuOption from '@/components/menu/MenuOption.vue'
import { ref } from 'vue'

const props = defineProps<{
  positions: { x: number; y: number }
  isMenuOpen: boolean
}>()

const emit = defineEmits<{
  (event: 'closeMenu'): void
}>()

const activeOption = ref(0)
</script>

<template>
  <AppMenu v-if="props.isMenuOpen" @closeMenu="emit('closeMenu')" :positions="props.positions">
    <div class="py-2 px-3 space-y-2">
      <MenuOption>
        <template #title>
          <span class="text-xs pb-1">Currently in</span>
        </template>

        <MenuItem :id="0" :activeOption="activeOption" @enter="activeOption = 0">
          <figure class="flex items-center gap-2">
            <img src="https://picsum.photos/200" alt="avatar" class="w-14 h-14 rounded-full" />

            <figcaption class="">
              <h1 class="text-base font-medium">Phineas Flynn</h1>
              <p class="text-sm text-slate-500">Personal</p>
              <p class="text-sm text-slate-500">vemik83731@cubene.com</p>
            </figcaption>
          </figure>
        </MenuItem>
      </MenuOption>

      <MenuOption>
        <template #title>
          <span class="text-xs pb-1">More Options</span>
        </template>

        <ul>
          <li>
            <router-link :to="{ name: 'settings' }">
              <MenuItem class="font-medium" :id="1" :activeOption="activeOption" @enter="activeOption = 1">
                Settings
              </MenuItem>
            </router-link>
          </li>

          <li>
            <router-link :to="{ name: 'logout' }">
              <MenuItem class="font-medium" :id="2" :activeOption="activeOption" @enter="activeOption = 2">
                Logout
              </MenuItem>
            </router-link>
          </li>
        </ul>
      </MenuOption>
    </div>
  </AppMenu>
</template>
