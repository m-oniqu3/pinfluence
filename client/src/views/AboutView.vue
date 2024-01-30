<script setup lang="ts">
// import { populateCreatedPins } from '@/scripts/populateCreatedPins'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

onMounted(async () => {
  console.log('mounted')

  // await populateCreatedPins()
})

const authStore = useAuthStore()

async function logout() {
  try {
    const response = await authStore.logout()

    if (response.status === 200) {
      authStore.setUser(null)
      authStore.removeSession()
      console.log(response.data.data)
      router.push('/')
    }

    console.log(response)

    //clear pinia state
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data.error ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    console.log('Failed to logout. ' + message, ' from logout')
  }
}
</script>

<template>
  <div class="about">
    <button @click="logout">Logout</button>
    <h1>This is an about page</h1>
  </div>
</template>

<style></style>
