import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

import type { User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const isAuth = computed(() => !!user.value?.id)
  const user: Ref<User | null> = ref(null)

  function setUser(data: User) {
    user.value = data
  }

  function logout() {
    user.value = null
  }
  return { isAuth, logout, user, setUser }
})
