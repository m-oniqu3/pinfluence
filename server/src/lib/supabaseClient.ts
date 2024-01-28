import { type Database } from '@server/lib/database.types'
import { createClient } from '@supabase/supabase-js'
  
const supabaseUrl = import.meta.env.SERVER_SUPABASE_PROJECT_URL
const supabaseKey = import.meta.env.SERVER_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)