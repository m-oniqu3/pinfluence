import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

import { supabase } from '@/lib/supabaseClient'
import type { User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const isAuth = computed(() => !!user.value?.id)
  const user: Ref<User | null> = ref(null)
  const isLoading = ref(false)

  function setUser(data: User) {
    user.value = data
  }

  function logout() {
    user.value = null
  }

  async function updateAuth() {
    supabase.auth.onAuthStateChange(async (_, session) => {
      isLoading.value = true

      if (session && session.user) {
        const user = {
          aud: session.user.aud,
          email: session.user.email as string,
          id: session.user.id
        }

        setUser(user)
      }
      isLoading.value = false
    })
  }

  return { isAuth, logout, user, setUser, updateAuth, isLoading }
})
