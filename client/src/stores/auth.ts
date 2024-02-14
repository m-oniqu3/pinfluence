import { type AuthTokenResponse, type Session, type User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

import { api } from '@/services/api'
import type { Profile } from '@/types/profile'

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<User | null> = ref(null)
  const isAuth = computed(() => !!user.value)

  function setUser(data: User | null) {
    user.value = data
  }

  function setSession(token: Session['access_token'], user: User) {
    localStorage.setItem('sb-token', token)
    localStorage.setItem('sb-user', JSON.stringify(user))
  }

  function removeSession() {
    localStorage.removeItem('sb-token')
    localStorage.removeItem('sb-user')
  }

  async function getUser() {
    const response = await api.get<{ data: User | null }>('auth')

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
    const response = await api.delete<{ data: string }>('auth')
    return response
  }

  async function getUserProfileById(id: string) {
    const response = await api.post<{ data: Profile }>('profile', { id })
    return response.data.data
  }

  async function getUserProfile() {
    const response = await api.get<{ data: Profile }>('profile')
    return response.data.data
  }

  async function updateProfileAvatar(id: string, formData: FormData) {
    const response = await api.post<{ data: string }>(`profile/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data.data
  }

  async function updateProfile(data: Profile) {
    const response = await api.put<{ data: Profile }>(`profile/${data.id}`, data)
    return response.data.data
  }

  return {
    isAuth,
    logout,
    user,
    setUser,
    getUser,
    login,
    signup,
    setSession,
    removeSession,
    getUserProfile,
    getUserProfileById,
    updateProfile,
    updateProfileAvatar
  }
})
