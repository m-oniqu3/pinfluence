import { supabase } from '@/lib/supabaseClient'
import { updateImageUrl } from '@/utils/updateImageUrl'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

interface Data {
  id: number
  name: string
  board_id: string | null
  image: string
  user_id: string
}

export const useFeedStore = defineStore('feed', () => {
  const pins: Ref<Data[]> = ref([])
  const isLoadingInitial = ref(false)
  const isLoadingMore = ref(false)
  const maxRange = ref(20)

  async function getInitialPins() {
    try {
      isLoadingInitial.value = true

      const { data, error } = await supabase
        .from('created-pins')
        .select('id, name, board_id, image, user_id')
        .range(0, maxRange.value)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        const result = data as unknown as Data[]

        const updatedData = result.map((pin) => {
          const updatedUrl = updateImageUrl(pin.image, pin.user_id)

          return { ...pin, image: updatedUrl }
        })

        pins.value = updatedData
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoadingInitial.value = false
    }
  }

  async function loadMorePins() {
    try {
      isLoadingMore.value = true
      const range = maxRange.value + 1
      maxRange.value += 20

      const { data, error } = await supabase
        .from('created-pins')
        .select('id, name, board_id, image, user_id')
        .range(range, maxRange.value)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!data || data.length === 0) return

      if (data.length > 0) {
        const result = data as unknown as Data[]
        const updatedData = result.map((pin) => {
          const updatedUrl = updateImageUrl(pin.image, pin.user_id)

          return { ...pin, image: updatedUrl }
        })
        pins.value.push(...updatedData)
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoadingMore.value = false
    }
  }

  return {
    pins,
    isLoadingInitial,
    isLoadingMore,
    getInitialPins,
    loadMorePins
  }
})
