import { api } from '@/services/api'
import type { PinDetails, PinPreview, SavedPinPreview } from '@/types/pin'

export async function createPin(formData: FormData) {
  const response = await api.post<{ data: string }>('pins', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data.data
}

export async function getUserCreatedPins(userId: string, range: [number, number]) {
  const response = await api.get<{ data: PinPreview[] }>(`pins/created/${userId}`, {
    params: { range }
  })

  return response.data.data
}

export async function getPinDetails(id: number) {
  const response = await api.get<{ data: PinDetails }>(`pins/${id}`)

  return response.data.data
}

export async function savePin(pinId: number, boardId: number) {
  const response = await api.post(`pins/save/${pinId}`, { boardId })

  return response.data
}

export async function getSavedPinsForBoard(userId: string, boardId: number, limit?: number) {
  const response = await api.get<{ data: SavedPinPreview }>(`pins/saved/${userId}`, {
    params: { boardId, limit }
  })

  return response.data.data
}
