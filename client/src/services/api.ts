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

//interceptor to check for token expiration
// interceptor to check for token expiration
api.interceptors.response.use(
  (response) => {
    // Return the response for successful requests
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized') // handle the unauthorized error;
      window.location.href = '/logout'
    } else if (error.response && error.response.status === 403) {
      console.log('Forbidden') // handle the forbidden error
    } else if (error.response && error.response.status === 404) {
      console.log('Not found') // handle the not found error with a redirect or a toast
    }
    // Return the error response
    return Promise.reject(error)
  }
)
