import { useAuthStore, type User } from '@/stores/auth'
import axios from 'axios'

// const authStore = useAuthStore()

/**
 * this creates an axios instance with the base url
 * set to the API path from the client vite config
 * it is a proxy to the server
 */

export const api = axios.create({
  baseURL: __API_PATH__,
  withCredentials: true
})

const instance = axios.create({
  baseURL: __API_PATH__,
  withCredentials: true
})
async function refreshToken() {
  try {
    //create a new axios instance to avoid infinite loop

    const response = await instance.post<{ data: { user: User; token: { access_token: string; expiry: string } } }>(
      '/refresh'
    )

    console.log(response)
  } catch (error: any) {
    console.log('Error refreshing token:', error.message)
    const authStore = useAuthStore()
    await instance.delete('auth')
    authStore.setUser(null)
    authStore.setToken(null)
  }
}

// function getTokenFromStore() {
//   const authStore = useAuthStore()
//   return authStore.token?.access_token
// }

api.interceptors.request.use(
  async (config) => {
    //const token = getTokenFromStore() // Implement this function to get token from wherever it's stored

    const token = localStorage.getItem('sb-token') || ''
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let isRefreshing = false

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { status, data } = error.response as { status: number; data: { error: string } }

    if (status === 401) {
      try {
        // Refresh the token
        console.log(data.error)
        if (!isRefreshing) {
          isRefreshing = true
          await refreshToken()
          isRefreshing = false
        }
      } catch (error) {
        console.log('Error refreshing token:', error)
      }
    } else if (error.response && error.response.status === 403) {
      console.log('Forbidden') // handle the forbidden error
    } else if (error.response && error.response.status === 404) {
      console.log('Not found') // handle the not found error with a redirect or a toast
    }
    // Return the error response
    return Promise.reject(error)
  }
)
