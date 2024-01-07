<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProfileBody'
})
</script>

<script setup lang="ts">
import AppMenu from '@/components/app/AppMenu.vue'
import MenuItem from '@/components/menu/MenuItem.vue'
import MenuOption from '@/components/menu/MenuOption.vue'

const isMenuOpen = ref(false)

const openMenu = () => (isMenuOpen.value = true)

const closeMenu = () => (isMenuOpen.value = false)
const positions = ref({ x: 0, y: 0 })

function getPosition(event: MouseEvent) {
  // Get mouse coordinates
  const { clientX, clientY } = event

  positions.value = { x: clientX, y: clientY }
}
</script>

<template>
  <header class="wrapper my-4">
    <nav class="h-32">
      <ul class="flex justify-center items-center gap-8 h-1/2 text-base">
        <li>
          <router-link :to="{ name: 'profile.created' }">Created </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'profile.saved' }">Saved</router-link>
        </li>
      </ul>

      <ul class="h-1/2 flex justify-between items-center">
        <li
          class="p-4 flex place-items-center hover:bg-neutral-100 hover:rounded-full cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-sliders" class="fa-lg" />
        </li>
        <li
          class="p-4 flex place-items-center hover:bg-neutral-100 hover:rounded-full cursor-pointer"
          :class="isMenuOpen ? 'bg-black rounded-full' : ''"
          @click="openMenu"
          @click.prevent="getPosition"
        >
          <font-awesome-icon
            icon="fa-solid fa-plus"
            class="fa-lg"
            :class="isMenuOpen ? 'text-white' : ''"
          />
        </li>
      </ul>
    </nav>
  </header>

  <router-view class="wrapper" />
  <AppMenu v-if="isMenuOpen" @closeMenu="closeMenu" :positions="positions">
    <MenuOption>
      <template #title>
        <span class="text-xs pb-1">Create</span>
      </template>

      <ul class="w-[10.5rem]" id="content">
        <MenuItem>
          <router-link :to="{ name: 'create' }">Pin</router-link>
        </MenuItem>

        <MenuItem><p>Board</p></MenuItem>
      </ul>
    </MenuOption>
  </AppMenu>
</template>

<style scoped>
a {
  font-weight: 600;
  padding: 0.3rem 0;
}

a.router-link-active {
  border-bottom: 3px solid;
}
</style>
