<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/auth'
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'

const auth = useAuthStore()
const isLoading = ref(false)

onMounted(() => {
  supabase.auth.onAuthStateChange((_, session) => {
    isLoading.value = true

    if (session && session.user) {
      console.log(session.user)
      const user: User = {
        aud: session.user.aud,
        email: session.user.email as string,
        id: session.user.id
      }
      auth.setUser(user)
    }
    isLoading.value = false
  })
})
</script>

<template>
  <p v-if="isLoading">Loading...</p>
  <RouterView v-else />
</template>

<style scoped></style>
