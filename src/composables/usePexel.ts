import pexelsClient from '@/lib/pexelsClient'
import { ref, type Ref } from 'vue'

export type PexelsPhoto = {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  liked: boolean
  alt: string
}

export type PexelsResponse = {
  page: number
  per_page: number
  photos: PexelsPhoto[]
  next_page: string
}

export function usePexels() {
  const photos: Ref<PexelsPhoto[]> = ref([])
  const isLoading = ref(false)

  async function fetchfirstBatchOfPhotos() {
    try {
      const response = (await pexelsClient.photos.curated({
        per_page: 25,
        page: 1
      })) as unknown as PexelsResponse

      if (response && 'photos' in response) {
        photos.value
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  async function loadMorePhotos(page: number) {
    try {
      const response = (await pexelsClient.photos.curated({
        per_page: 15,
        page
      })) as unknown as PexelsResponse

      if (response && 'photos' in response) {
        photos.value.push(...response.photos)
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    photos,
    isLoading,
    fetchfirstBatchOfPhotos,
    loadMorePhotos
  }
}
