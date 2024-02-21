import router from '@/router'
import { useAuthStore } from '@/stores/auth'
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

async function refreshToken() {
  const authStore = useAuthStore()
  const response = await axios.post<{
    data: { token: { access_token: string; expiry: string }; user: { id: string; email: string } }
  }>('/auth/refresh')

  authStore.setToken(response.data.data.token)
  authStore.setUser(response.data.data.user)

  return response.data.data.token.access_token
}

function getTokenFromStore() {
  const authStore = useAuthStore()
  return authStore.token?.access_token
}

api.interceptors.request.use(
  async (config) => {
    const token = getTokenFromStore() // Implement this function to get token from wherever it's stored
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
    console.log('Error response', data)

    if (status === 401 && !isRefreshing) {
      try {
        // Refresh the token
        isRefreshing = true
        const refreshedToken = await refreshToken()

        // Update the request headers with the new token
        error.config.headers['Authorization'] = `Bearer ${refreshedToken}`

        // Retry the original request
        return axios.request(error.config)
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError)

        router.push({ name: 'logout' })
        return Promise.reject(refreshError)
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
