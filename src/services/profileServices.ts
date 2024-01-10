import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import type { ProfileData } from '@/types/profile'

async function getProfileDetails() {
  const profile = useProfileStore()
  try {
    const auth = useAuthStore()

    if (!auth.isAuth || !auth.user) throw new Error('You must be logged in to update your profile.')

    const { data, error } = await supabase
      .from('profiles')
      .select(`full_name, username, website, avatar_url, about`)
      .eq('id', auth.user.id)
      .single()

    if (error) throw error

    // save to store instead of returning
    profile.setProfile(data as ProfileData)
  } catch (error: any) {
    console.error(error, error.message)
  }
}

const updateProfile = async () => {
  console.log('update profile')
  const profile = useProfileStore()
  const auth = useAuthStore()

  if (auth.isAuth && !profile.details) {
    try {
      await getProfileDetails()
    } catch (error: any) {
      console.error('Error fetching profile details:', error.message)
    }
  }
}

export const downloadImage = async (url: string) => {
  try {
    const { data, error } = await supabase.storage.from('avatars').download(url)
    if (error) throw error
    return URL.createObjectURL(data)
  } catch (error: any) {
    console.error('Error downloading image: ', error.message)
  }
}
