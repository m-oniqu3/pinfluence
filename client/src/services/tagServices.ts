import { api } from '@/services/api'
import type { Tag } from '@/types/tag'

export async function getTags(val: string) {
  const response = await api.get<{ data: Tag[] | null }>(`/tags/${val}`)
  return response.data.data
}

export async function createTag(tag: string) {
  const response = await api.post<{ data: Tag | null }>('tags', { tag })
  return response.data.data
}
