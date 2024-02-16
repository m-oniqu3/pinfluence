import { api } from '@/services/api'

export async function createBoard(board: { name: string; secret: boolean }) {
  const response = await api.post<{ data: number }>('boards', board)
  return response.data.data
}

export async function getBoardById(id: string | null) {
  // // if no id, early return
  // if (!id) return null
  // const { data, error } = await supabase.from('boards').select('id, name').eq('id', id).single()
  // if (error) throw error
  // return data as BoardInfo
}
