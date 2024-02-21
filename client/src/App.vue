<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { isAxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
const authStore = useAuthStore()
const isLoading = ref(true)
const router = useRouter()

onMounted(async () => {
  try {
    // only refresh token if user is logged in
    if (!authStore.user) return

    isLoading.value = true

    // get token from server
    const response = await authStore.refreshToken()

    if (!response.token || !response.user) {
      console.log('from App.vue, no token or user')
      router.push('/logout')
    }

    console.log('from App.vue, response', response)

    // set user and token
    authStore.setUser(response.user)
    authStore.setToken(response.token)

    // // update axios headers
    api.defaults.headers.common['Authorization'] = `Bearer ${response.token.access_token}`
    api.defaults.headers.common['Content-Type'] = 'application/json'
  } catch (error: any) {
    console.log('from App.vue')
    if (isAxiosError(error)) {
      console.log(error.response?.data ?? error.message)
    } else {
      console.log(error.message ?? 'Something went wrong. Could not refresh token')
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <p v-if="isLoading">Loading...</p>
  <template v-else>
    <AppNavbar />
    <div class="mt-24" style="{ minHeight: 'calc(100vh - 96px)' }">
      <RouterView />
    </div>
  </template>
</template>

<style scoped></style>
