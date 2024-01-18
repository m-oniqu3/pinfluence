<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'
import { useBoardStore } from '@/stores/board'
import { useCreatedPinsStore } from '@/stores/createdPins'
import { useProfileStore } from '@/stores/profile'

import { computed, onMounted, watchEffect } from 'vue'
import { RouterView } from 'vue-router'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const boardsStore = useBoardStore()
const createdPinsStore = useCreatedPinsStore()

const isLoading = computed(() => {
  return authStore.isLoading || profileStore.isLoading || boardsStore.isLoading
})

onMounted(async () => {
  await authStore.updateAuth()

  // Watch for changes in auth.isAuth and fetch profile details accordingly
  watchEffect(async () => {
    if (authStore.isAuth) {
      if (!profileStore.details) {
        await profileStore.getProfileDetails().then
      }

      if (!boardsStore.boards) {
        boardsStore.getBoards()
      }
      if (!createdPinsStore.sortedPins.length) {
        createdPinsStore.getCreatedPins()
      }
    }
  })
})
</script>

<template>
  <p v-if="isLoading">Loading...</p>

  <template v-else>
    <AppNavbar />
    <div class="mt-24">
      <RouterView />
    </div>
  </template>
</template>

<style scoped></style>
