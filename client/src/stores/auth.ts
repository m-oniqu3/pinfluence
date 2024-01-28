import { type AuthTokenResponse, type Session, type User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<User | null> = ref(null)
  const isAuth = computed(() => !!user.value?.id)

  function setUser(data: User | null) {
    user.value = data
  }

  function setSession(token: Session['access_token']) {
    localStorage.setItem('sb-token', token)
  }

  function removeSession() {
    localStorage.removeItem('sb-token')
  }

  async function getUser() {
    // const { data, error } = await supabase.auth.getUser()
    // if (error) {
    //   if (error.status === 404 || error.status === 401) {
    //     await logout()
    //     throw new Error('Not authenticated')
    //   }
    // }
    // if (data.user && !error) {
    //   console.log(data.user)
    //   setUser({
    //     id: data.user.id,
    //     email: data.user.email as string,
    //     aud: data.user.aud
    //   })
    // }
  }

  async function login(credentials: { email: string; password: string }) {
    const response = await api.post<AuthTokenResponse>('auth', credentials)
    return response.data.data
  }

  async function logout() {
    // remove the header and delete it from storage
    // const { error } = await supabase.auth.signOut()

    // if (error) {
    //   console.log(error)
    //   return
    // }

    setUser(null)
  }

  return { isAuth, logout, user, setUser, getUser, login, setSession, removeSession }
})
