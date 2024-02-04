<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import { RouterView } from 'vue-router'

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

// onMounted(async () => {
//   try {
//     loading.value = true
//     console.log('getting user')
//     const data = await authStore.getUser()

//     console.log(data, ' from App.vue')

//     authStore.setUser(data)
//   } catch (error: any) {
//     let message = ''

//     if (axios.isAxiosError(error)) {
//       message = error.response?.data.error ?? error.message
//     } else {
//       message = 'Something went wrong. Please try again.'
//     }

//     console.log(message, ' from App.vue')
//     authStore.setUser(null)
//   } finally {
//     loading.value = false
//     console.log('finished getting user')
//   }
// })
</script>

<template>
  <AppNavbar />
  <div class="mt-24">
    <RouterView :style="{ minHeight: 'calc(100vh - 96px)' }" />
  </div>
</template>

<style scoped></style>
