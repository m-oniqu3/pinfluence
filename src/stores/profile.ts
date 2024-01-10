import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import type { Profile, ProfileData } from '@/types/profile'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  const auth = useAuthStore()
  const details: Ref<Profile | null> = ref(null)
  const isLoading = ref(false)

  function setProfile(data: ProfileData) {
    const [firstName, lastName] = data.full_name.split(' ')
    details.value = {
      ...data,
      firstName,
      lastName
    }
  }

  async function getProfileDetails() {
    try {
      isLoading.value = true
      if (!auth.isAuth || !auth.user)
        throw new Error('You must be logged in to update your profile.')

      const { data, error } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url, about`)
        .eq('id', auth.user.id)
        .select(`*`)

      if (error) throw error

      if (data[0]) {
        setProfile(data[0] as ProfileData)
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    details,
    setProfile,
    getProfileDetails,
    isLoading
  }
})
