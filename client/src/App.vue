<script setup lang="ts">
import { api } from '@/services/api'
import { onMounted } from 'vue'
// const authStore = useAuthStore()
// const profileStore = useProfileStore()
// const boardsStore = useBoardStore()

// const isLoading = computed(() => {
//   return authStore.isLoading || profileStore.isLoading || boardsStore.isLoading
// })

// const isLoading = ref(false)

onMounted(() => {
  api
    .get('/')
    .then((res) => {
      console.log(res.data)
    })

    .catch((error) => {
      console.error('Error fetching data:', error)
    })
})

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
</script>

<template>
  <p>hey</p>
  <!-- <p v-if="isLoading || authStore.isLoading" class="text-center">Loading...</p> -->

  <!-- <template v-else>
    <AppNavbar />
    <div class="mt-24">
      <RouterView />
    </div>
  </template> -->
</template>

<style scoped></style>
