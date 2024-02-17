import { api } from '@/services/api'
import type { PinPreview } from '@/types/pin'

export async function createPin(formData: FormData) {
  const response = await api.post<{ data: string }>('pins', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data.data
}

export async function getUserCreatedPins() {
  const response = await api.get<{ data: PinPreview[] }>('pins')

  return response.data.data
}
