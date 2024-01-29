<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import { RouterView } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()
// const profileStore = useProfileStore()
// const boardsStore = useBoardStore()

// const isLoading = computed(() => {
//   return authStore.isLoading || profileStore.isLoading || boardsStore.isLoading
// })

// const isLoading = ref(false)

// onMounted(async () => {
//   isLoading.value = true
//   try {
//     await authStore.getUser()

//     if (!authStore.user?.id) return

//     //promise.all to run multiple promises at the same time

//     await Promise.all([boardsStore.getBoards(), profileStore.getProfileDetails()])
//   } catch (error) {
//     console.log(error, ' from App.vue')
//   } finally {
//     isLoading.value = false
//   }
// })

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const data = await authStore.getUser()

    authStore.setUser(data)
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data.error ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    console.log(message, ' from App.vue')
    authStore.setUser(null)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <p v-if="loading">Loading...</p>

  <template v-else>
    <AppNavbar />
    <div class="mt-24">
      <RouterView />
    </div>
  </template>
</template>

<style scoped></style>
