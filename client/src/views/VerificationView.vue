<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'VerificationView'
})
</script>

<script setup lang="ts">
import AppSpinner from '@/components/app/AppSpinner.vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const router = useRouter()
const error = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()

async function verifyToken() {
  try {
    const access_token = router.currentRoute.value.hash

    if (!access_token) {
      throw new Error('Invalid token')
    }
    const brokenToken = access_token.split('=')

    if (brokenToken.length < 2) {
      throw new Error('Invalid token')
    }

    const token = brokenToken[1].split('&')[0]

    //attach token to the header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    api.defaults.headers.common['Content-Type'] = 'application/json'

    const data = await authStore.getUser()

    if (data) {
      router.replace({ name: 'login' })
    }
  } catch (error: any) {
    let message = ''

    if (axios.isAxiosError(error)) {
      message = error.response?.data.error ?? error.message
    } else {
      message = 'Something went wrong. Please try again.'
    }

    console.log(message)
    error.value = message
    router.replace({ name: 'register' })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  await verifyToken()
})
</script>

<template>
  <section class="wrapper h-full grid place-content-center">
    <article v-if="isLoading" class="flex flex-col items-center gap-3 h-full">
      <h1 class="font-semibold text-center">
        Sit tight while we <br />
        verify your account.
      </h1>
      <AppSpinner />
    </article>

    <p v-if="error">
      {{ error }}
    </p>

    <p v-else class="text-center font-semibold">Redirecting...</p>
  </section>
</template>
