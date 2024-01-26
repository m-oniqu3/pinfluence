import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { type PinPreview } from '@/types/pin'
import { updateImageUrl } from '@/utils/updateImageUrl'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useCreatedPinsStore = defineStore('createdPins', () => {
  const createdPins: Ref<PinPreview[] | null> = ref(null)
  const url = import.meta.env.VITE_SUPABASE_STORAGE_URL

  const auth = useAuthStore()
  const isLoading = ref(false)

  function addPin(pin: PinPreview) {
    if (!createdPins.value) {
      createdPins.value = []
    }

    if (!auth.user) {
      console.log('no user')
      return
    }

    const src = url + '/created-pins/' + auth.user.id

    createdPins.value.push({ ...pin, image: src + '/' + pin.image })
  }

  async function getCreatedPins() {
    // Ensure that auth.user is not null before proceeding
    if (!auth.user) {
      return
    }

    try {
      isLoading.value = true

      const { data, error } = await supabase
        .from('created-pins')
        .select(`id, name, image, board_id, user_id`)
        .order('created_at', { ascending: false })
        .eq('user_id', auth.user.id)

      if (error) {
        throw error
      }

      if (data && auth.user.id) {
        const updatedData = data.map((pin) => {
          const imageUrl = updateImageUrl(pin.image, auth.user!.id)

          return { ...pin, image: imageUrl } as PinPreview
        })

        createdPins.value = updatedData
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    createdPins,
    addPin,
    getCreatedPins,
    isLoading
  }
})
