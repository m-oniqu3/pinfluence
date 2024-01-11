import type { PexelsPhoto, PexelsResponse } from '@/composables/usePexel'
import { ref, type Ref } from 'vue'

import pexelsClient from '@/lib/pexelsClient'

export function useSearchPexels() {
  const photos: Ref<PexelsPhoto[]> = ref([])
  const isLoading = ref(true)

  async function fetchfirstBatchOfPhotos(value: string) {
    isLoading.value = true
    try {
      const response = (await pexelsClient.photos.search({
        query: value,
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

  async function loadMorePhotos(page: number, value: string) {
    isLoading.value = true
    try {
      const response = (await pexelsClient.photos.search({
        query: value,
        per_page: 25,
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
