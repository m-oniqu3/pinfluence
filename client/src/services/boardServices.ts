import { api } from '@/services/api'
import type { Board } from '@/types/board'

export async function createBoard(board: { name: string; secret: boolean }) {
  const response = await api.post<{ data: number }>('boards', board)
  return response.data.data
}

export async function getBoards(sortBy: string, order: string) {
  const response = await api.get<{ data: Board[] }>('boards', {
    params: { sortBy, order }
  })

  return response.data.data
}

export async function getBoardById(id: string | null) {
  // // if no id, early return
  // if (!id) return null
  // const { data, error } = await supabase.from('boards').select('id, name').eq('id', id).single()
  // if (error) throw error
  // return data as BoardInfo
}
