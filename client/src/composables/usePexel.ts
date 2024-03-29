import pexelsClient from '@/lib/pexelsClient'
import type { PexelsPhoto, PexelsResponse } from '@/types/pexels'
import { ref, type Ref } from 'vue'

export function usePexels() {
  const photos: Ref<PexelsPhoto[]> = ref([])
  const isLoading = ref(false)

  console.log(isLoading.value)

  async function fetchfirstBatchOfPhotos() {
    isLoading.value = true
    console.log('fetching first batch of photos')
    try {
      const response = (await pexelsClient.photos.curated({
        per_page: 25,
        page: 1
      })) as unknown as PexelsResponse

      if (response && 'photos' in response) {
        photos.value = response.photos
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
