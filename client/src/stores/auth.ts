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
    const response = await api.get<{ data: User | null }>('auth')
    console.log(response.data)
    return response.data.data
  }

  async function login(credentials: { email: string; password: string }) {
    const response = await api.post<AuthTokenResponse>('auth', credentials)
    return response.data.data
  }

  async function signup(credentials: { email: string; password: string }) {
    const response = await api.post<AuthTokenResponse>('auth/signup', credentials)
    return response.data.data
  }

  async function logout() {
    // remove the header and delete it from storage
    const response = await api.delete<{ data: string }>('auth')
    return response
  }

  return { isAuth, logout, user, setUser, getUser, login, signup, setSession, removeSession }
})
