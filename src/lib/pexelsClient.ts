import { createClient } from 'pexels'

const key = import.meta.env.VITE_PEXELS_API_KEY
const client = createClient(key)

export default client
