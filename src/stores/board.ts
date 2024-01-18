import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import type { Board, NewBoard } from '@/types/board'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useBoardStore = defineStore('board', () => {
  const auth = useAuthStore()
  const boards: Ref<Board[] | null> = ref(null)
  const boardKeys: Ref<{ [key: string]: string } | null> = ref(null)

  const isLoading = ref(false)

  function setBoards(data: Board[]) {
    boards.value = data
  }

  function addBoardKey(id: string, name: string) {
    if (!boardKeys.value) {
      boardKeys.value = {}
    }

    boardKeys.value[id] = name
  }

  function addBoard(board: Board) {
    boards.value?.push(board)
    addBoardKey(board.id, board.name)
  }

  async function createBoard(boardData: NewBoard) {
    try {
      isLoading.value = true

      if (!auth.isAuth || !auth.user) throw new Error('Cannot create board.')
      const { data, error } = await supabase
        .from('boards')
        .insert({ ...boardData, user_id: auth.user.id })
        .select('id')
      if (error) throw error

      if (data[0].id) {
        const { data: board, error: boardError } = await supabase.from('boards').select('*')

        if (boardError) throw boardError

        addBoard(board[0] as Board)
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  async function getBoards() {
    try {
      isLoading.value = true
      const { data, error } = await supabase
        .from('boards')
        .select('id, name, secret, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      boards.value = data as Board[]

      boards.value.forEach((board) => {
        addBoardKey(board.id, board.name)
      })
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    boards,
    isLoading,
    setBoards,
    createBoard,
    getBoards,
    boardKeys
  }
})
