import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

import { supabase } from '@/lib/supabaseClient'
import type { User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<User | null> = ref(null)
  const isAuth = computed(() => !!user.value)

  const isLoading = ref(false)

  function setUser(data: User | null) {
    user.value = data
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error)
      return
    }

    setUser(null)
  }

  return { isAuth, logout, user, setUser, isLoading }
})
