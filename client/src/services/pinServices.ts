import { api } from '@/services/api'

export async function createPin(formData: FormData) {
  const response = await api.post<{ data: any }>('pins', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  console.log(response.data)
  return response.data.data
}
