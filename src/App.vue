<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import { supabase } from '@/lib/supabaseClient'
import { updateProfile } from '@/services/profileServices'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import type { User } from '@/types/auth'

import { onMounted, ref, watchEffect } from 'vue'
import { RouterView } from 'vue-router'

const auth = useAuthStore()
const profile = useProfileStore()
const isLoading = ref(true)

onMounted(() => {
  supabase.auth.onAuthStateChange(async (_, session) => {
    isLoading.value = true

    if (session && session.user) {
      const user: User = {
        aud: session.user.aud,
        email: session.user.email as string,
        id: session.user.id
      }

      auth.setUser(user)
    }
    isLoading.value = false
  })

  // Watch for changes in auth.isAuth and fetch profile details accordingly
  watchEffect(() => {
    if (auth.isAuth && !profile.details) {
      isLoading.value = true
      updateProfile().finally(() => (isLoading.value = false))
    }
  })

  // Fetch profile details when the component is mounted
  // updateProfile()
})
</script>

<template>
  <p v-if="isLoading">Loading...</p>

  <template v-else>
    <AppNavbar />
    <RouterView />
  </template>
</template>

<style scoped></style>
