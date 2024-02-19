import { api } from '@/services/api'
import type { Board } from '@/types/board'

export async function createBoard(board: { name: string; secret: boolean }) {
  const response = await api.post<{ data: number }>('boards', board)
  return response.data.data
}

// get boards for any user
export async function getBoards(sortBy: string, order: string, userId: string, range: [number, number]) {
  const response = await api.get<{ data: Board[] }>(`boards/user/${userId}`, {
    params: { sortBy, order, range }
  })

  return response.data.data
}

export async function getCurrentUserBoards(sortBy: string, order: string) {
  const response = await api.get<{ data: Board[] }>('boards', {
    params: { sortBy, order }
  })

  return response.data.data
}

export async function getBoardById(id: number) {
  const response = await api.get<{ data: Board }>(`boards/${id}`)
  return response.data.data
}

export async function updateBoard(board: { id: number; name: string; secret: boolean; description: string }) {
  const response = await api.put(`boards/${board.id}`, board)
  return response.data
}
