<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'
import { useBoardStore } from '@/stores/board'
import { useProfileStore } from '@/stores/profile'

import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const boardsStore = useBoardStore()

const isLoading = computed(() => {
  return authStore.isLoading || profileStore.isLoading || boardsStore.isLoading
})

onMounted(async () => {
  if (authStore.isAuth) {
    if (!boardsStore.boards.size) {
      await boardsStore.getBoards()
    }

    if (!profileStore.details) {
      await profileStore.getProfileDetails()
    }
  }
})
</script>

<template>
  <p v-if="isLoading" class="text-center">Loading...</p>

  <template v-else>
    <AppNavbar />
    <div class="mt-24">
      <RouterView />
    </div>
  </template>
</template>

<style scoped></style>
