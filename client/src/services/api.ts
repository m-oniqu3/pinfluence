import axios from 'axios'

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
