<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'
import { useBoardStore } from '@/stores/board'
import { useProfileStore } from '@/stores/profile'

import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const boardsStore = useBoardStore()

// const isLoading = computed(() => {
//   return authStore.isLoading || profileStore.isLoading || boardsStore.isLoading
// })

const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    await authStore.getUser()

    if (!authStore.user?.id) return

    //promise.all to run multiple promises at the same time

    await Promise.all([boardsStore.getBoards(), profileStore.getProfileDetails()])
  } catch (error) {
    console.log(error, ' from App.vue')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <p v-if="isLoading || authStore.isLoading" class="text-center">Loading...</p>

  <template v-else>
    <AppNavbar />
    <div class="mt-24">
      <RouterView />
    </div>
  </template>
</template>

<style scoped></style>
