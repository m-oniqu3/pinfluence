import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_PROJECT_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(url, key)
