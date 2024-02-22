<script lang="ts">
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { isAxiosError } from 'axios'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LogoutView'
})
</script>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  try {
    //clear axios headers
    delete api.defaults.headers.common['Authorization']
    delete api.defaults.headers.common['Content-Type']

    const response = await authStore.logout()

    console.log('response from logout', response)

    //clear store
    authStore.setUser(null)
    authStore.setToken(null)

    //redirect to login
    router.push({ name: 'login' })
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
  }
})
</script>

<template>
  <div></div>
</template>
