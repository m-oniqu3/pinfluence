import axios from 'axios'
import { useRouter } from 'vue-router'

const token = localStorage.getItem('sb-token')

/**
 * this creates an axios instance with the base url
 * set to the API path from the client vite config
 * it is a proxy to the server
 */

export const api = axios.create({
  baseURL: __API_PATH__
})

// set headers if token exists
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  api.defaults.headers.common['Content-Type'] = 'application/json'
}

const router = useRouter()

//interceptor to check for token expiration
api.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      router.push('/logout')
    } else if (response.status === 403) {
      console.log('Forbidden') // handle the forbidden error
    } else if (response.status === 404) {
      console.log('Not found') // handle the not found error with a redirect or a toast
    }
    // Return the response for other status codes
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
