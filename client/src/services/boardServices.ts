import { api } from '@/services/api'
import type { Board, BoardOwnerProfile } from '@/types/board'
import { getRange } from '@/utils/paginate'

export async function createBoard(board: { name: string; secret: boolean }) {
  const response = await api.post<{ data: string }>('boards', board)
  return response.data.data
}

/**
 * @param sortBy string
 * @param order string
 * @param userId string
 * @param page number
 * @returns Board[]
 * @description Returns a range of boards created by given user
 */
export async function getBoards(sortBy: string, order: string, userId: string, page: number) {
  const response = await api.get<{ data: Board[] }>(`boards/user/${userId}`, {
    params: { sortBy, order, range: getRange(page, 10) }
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
  const response = await api.put<{ data: string }>(`boards/${board.id}`, board)
  return response.data.data
}

/**
 *
 * @param id
 * @returns string
 * @description Deletes a board by id
 */
export async function deleteBoard(id: number) {
  const response = await api.delete<{ data: string }>(`boards/${id}`)
  return response.data.data
}

/**
 * @param boardID number
 * @param userID string
 * @returns BoardOwnerProfile
 * @description Returns the owner of the given board
 */
export async function getBoardOwner(boardID: number, userID: string) {
  const response = await api.get<{ data: BoardOwnerProfile }>(`boards/${boardID}/user/${userID}`)
  return response.data.data
}

/**
 * @returns Board[]
 * @description Returns the most recent boards pins were saved to
 */
export async function getRecentBoards() {
  const response = await api.get<{ data: Board[] }>('boards/recents')

  return response.data.data
}
