import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import type { ProfileData } from '@/types/profile'

export async function getProfileDetails() {
  try {
    const auth = useAuthStore()

    if (!auth.user) throw new Error('You must be logged in to update your profile.')

    const { data, error } = await supabase
      .from('profiles')
      .select(`full_name, username, website, avatar_url, about`)
      .eq('id', auth.user.id)
      .single()

    if (error) throw error

    return data as ProfileData
  } catch (error: any) {
    console.error(error, error.message)
  }
}
