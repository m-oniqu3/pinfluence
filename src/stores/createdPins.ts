import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

type CreatedPin = {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  board_id: string | null
  link: string
}

export const useCreatedPinsStore = defineStore('createdPins', () => {
  const createdPins: Ref<CreatedPin[] | null> = ref(null)
  const url = import.meta.env.VITE_SUPABASE_STORAGE_URL

  const auth = useAuthStore()
  const isLoading = ref(false)

  function addPin(pin: CreatedPin) {
    if (!createdPins.value) {
      createdPins.value = []
    }
    if (!auth.user) {
      console.log('no user')
      return
    }

    const src = url + '/' + auth.user.id

    createdPins.value.push({
      ...pin,
      image_url: src + '/' + pin.image_url
    })
  }

  async function getCreatedPins() {
    try {
      isLoading.value = true

      if (!auth.user) return

      const { data, error } = await supabase
        .from('created-pins')
        .select(`*`)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        const src = url + '/' + auth.user.id

        const updatedData = data.map((pin) => {
          return { ...pin, image_url: src + '/' + pin.image }
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
