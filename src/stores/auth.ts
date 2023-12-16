import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref(false)

  function login() {
    isAuth.value = true
  }
  function logout() {
    isAuth.value = false
  }
  return { isAuth, login, logout }
})
