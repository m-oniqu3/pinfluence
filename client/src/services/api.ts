import axios from 'axios'

/**
 * @description
 * this creates an axios instance with the base url
 * set to the API path from the client vite config
 * it is a proxy to the server
 */

export const api = axios.create({
  baseURL: __API_PATH__
})
