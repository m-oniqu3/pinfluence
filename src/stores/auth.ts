import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

import { supabase } from '@/lib/supabaseClient'
import type { User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<User | null> = ref(null)
  const isAuth = computed(() => !!user.value?.id)

  const isLoading = ref(false)

  function setUser(data: User | null) {
    user.value = data
  }

  function setIsLoading(value: boolean) {
    isLoading.value = value
  }

  async function getUser() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      if (data.session?.user) {
        const user = data.session.user
        setUser({
          id: user.id,
          email: user.email as string,
          aud: user.aud
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    return error
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error)
      return
    }

    setUser(null)
  }

  return { isAuth, logout, user, setUser, isLoading, setIsLoading, getUser, login }
})
