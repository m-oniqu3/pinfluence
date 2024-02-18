<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProfileBody'
})
</script>

<script setup lang="ts">
import AppModal from '@/components/app/AppModal.vue'
import CreateBoard from '@/components/boards/CreateBoard.vue'
import ProfileMenu from '@/components/profile/ProfileMenu.vue'

const isMenuOpen = ref(false)
const isBoardModalOpen = ref(false)

const openMenu = () => (isMenuOpen.value = true)
const closeMenu = () => (isMenuOpen.value = false)
const positions = ref({ x: 0, y: 0 })

const openBoardModal = () => (isBoardModalOpen.value = true)
const closeBoardModal = () => (isBoardModalOpen.value = false)

function getPosition(event: MouseEvent) {
  // Get mouse coordinates
  const { clientX, clientY } = event
  positions.value = { x: clientX, y: clientY }
}
</script>

<template>
  <header class="bg-white sticky top-20 z-[1]">
    <nav class="h-24 wrapper">
      <ul class="flex justify-center items-center gap-8 h-full text-base">
        <li>
          <router-link :to="{ name: 'profile.created' }">Created</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'profile.saved' }">Saved</router-link>
        </li>
      </ul>
    </nav>
  </header>

  <ul class="wrapper h-16 flex justify-between items-center">
    <li class="p-4 flex place-items-center hover:bg-neutral-100 hover:rounded-full cursor-pointer">
      <font-awesome-icon icon="fa-solid fa-sliders" class="fa-lg" />
    </li>
    <li
      class="p-4 flex place-items-center hover:bg-neutral-100 hover:rounded-full cursor-pointer"
      :class="isMenuOpen ? 'bg-black rounded-full' : ''"
      @click="openMenu"
      @click.prevent="getPosition"
    >
      <font-awesome-icon icon="fa-solid fa-plus" class="fa-lg" :class="isMenuOpen ? 'text-white' : ''" />
    </li>
  </ul>

  <router-view />

  <ProfileMenu
    :positions="positions"
    :isMenuOpen="isMenuOpen"
    @closeMenu="closeMenu"
    @open-board-modal="openBoardModal"
  />

  <AppModal @close-modal="closeBoardModal" :open="isBoardModalOpen">
    <CreateBoard @close-modal="closeBoardModal" />
  </AppModal>
</template>

<style scoped>
nav a {
  font-weight: 600;
  padding: 0.3rem 0;
}

nav a.router-link-active {
  border-bottom: 3px solid;
}

#content,
#content * {
  font-weight: 600;
}
</style>
