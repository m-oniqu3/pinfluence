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

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('sb-token')
    console.log('Token:', token)
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

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { status } = error.response as { status: number; data: { error: string } }
    const originalRequest = error.config
    console.log('Error:', error.response.data)

    if (status === 401 && error.response.data.error.includes('Invalid Refresh Token')) {
      // remove the header from the request
      delete api.defaults.headers.common['Authorization']
      const authStore = useAuthStore()
      // remove the token from the store
      authStore.setToken(null)
      authStore.setUser(null)

      // redirect to the logout page
      router.push('/logout')

      return
    } else if (status === 401 && error.response.data.error.includes('Token expired')) {
      try {
        // remove the header from the request
        delete api.defaults.headers.common['Authorization']

        const authStore = useAuthStore()
        authStore.setToken(null)

        // get a new token
        const response = await api.post<{ data: { token: { access_token: string; expiry: string } } }>('/refresh')

        // set the new token in the header
        authStore.setToken(response.data.data.token)

        originalRequest.headers['Authorization'] = `Bearer ${response.data.data.token.access_token}`

        return api(originalRequest)
      } catch (error) {
        console.log('Error refreshing token:', error)
        return Promise.reject(error)
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
