import { useAuthStore } from '@/stores/auth'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_PROJECT_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(url, key)

//onAuthStateChange

supabase.auth.onAuthStateChange((_event, session) => {
  const authStore = useAuthStore()
  console.log('onAuthStateChange is running')

  if (session && session.user) {
    authStore.setUser({
      id: session.user.id,
      email: session.user.email as string,
      aud: session.user.aud
    })
  } else {
    authStore.setUser(null)
  }
})
