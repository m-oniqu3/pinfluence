import type { Profile, ProfileData } from '@/types/profile'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  const details: Ref<Profile | null> = ref(null)

  function setProfile(data: ProfileData) {
    const [firstName, lastName] = data.full_name.split(' ')
    details.value = {
      ...data,
      firstName,
      lastName
    }
  }

  return {
    details,
    setProfile
  }
})
