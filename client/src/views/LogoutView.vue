<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LogoutView'
})
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router'

//clear store
const authStore = useAuthStore()
authStore.setUser(null)
authStore.removeSession()

//redirect to login

const router = useRouter()
router.push({ name: 'login' })
</script>

<template>
  <div></div>
</template>
