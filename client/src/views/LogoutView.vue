<script lang="ts">
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
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
  await authStore.logout()

  //clear store
  authStore.setUser(null)
  authStore.setToken(null)

  //clear axios headers
  delete api.defaults.headers.common['Authorization']
  delete api.defaults.headers.common['Content-Type']

  //redirect to login
  router.push({ name: 'login' })
})
</script>

<template>
  <div></div>
</template>
