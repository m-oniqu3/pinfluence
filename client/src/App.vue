<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
// import { useAuthStore } from '@/stores/auth'
import { RouterView } from 'vue-router'
// const authStore = useAuthStore()
// const isLoading = ref(true)
// const router = useRouter()

// onMounted(async () => {
//   try {
//     // only refresh token if user is logged in
//     if (!authStore.user) return

//     console.log('from App.vue, refreshing token')
//     isLoading.value = true

//     // get token from server
//     const response = await authStore.refreshToken()

//     if (!response.token || !response.user) {
//       console.log('from App.vue, no token or user')
//       router.push('/logout')
//     }

//     console.log('from App.vue, response', response)

//     localStorage.setItem('sb-token', response.token.access_token)
//     // set user and token
//     authStore.setUser(response.user)
//     authStore.setToken(response.token)

//     // // update axios headers
//     api.defaults.headers.common['Authorization'] = `Bearer ${response.token.access_token}`
//     api.defaults.headers.common['Content-Type'] = 'application/json'
//   } catch (error: any) {
//     console.log('from App.vue')
//     if (isAxiosError(error)) {
//       console.log(error.response?.data ?? error.message)
//     } else {
//       console.log(error.message ?? 'Something went wrong. Could not refresh token')
//     }
//   } finally {
//     isLoading.value = false
//   }
// })
</script>

<template>
  <!-- <p v-if="isLoading">Loading...</p> -->
  <!-- <template v-else> -->
  <AppNavbar />
  <div class="mt-24" style="{ minHeight: 'calc(100vh - 96px)' }">
    <RouterView />
  </div>
  <VueQueryDevtools :button-position="'top-left'" />
  <!-- </template> -->
</template>

<style scoped></style>
