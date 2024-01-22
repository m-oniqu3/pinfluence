import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import type { Board, NewBoard } from '@/types/board'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useBoardStore = defineStore('board', () => {
  const auth = useAuthStore()

  const boards: Ref<Map<Board['id'], Board>> = ref(new Map())

  const isLoading = ref(false)

  function insertBoard(id: Board['id'], board: Board): void {
    // Logic to insert a new board entry
    boards.value.set(id, board)
  }

  async function createBoard(boardData: NewBoard) {
    try {
      isLoading.value = true

      if (!auth.isAuth || !auth.user) throw new Error('Cannot create board.')

      const entry = Object.assign({}, boardData, { user_id: auth.user.id })

      const { data, error } = await supabase
        .from('boards')
        .insert(entry)
        .select('id, name, secret, created_at')
        .single()
      if (error) throw error

      console.log(data)
      if (data) {
        console.log(data)
        insertBoard(data.id, data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  async function getBoards() {
    try {
      console.log('Getting boards')
      isLoading.value = true
      const { data, error } = await supabase
        .from('boards')
        .select('id, name, secret, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!data.length) {
        console.log('No data yet, early return')
        return
      }

      if (data.length > 0) {
        data.forEach((board: Board) => {
          insertBoard(board.id, board)
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    boards,
    isLoading,

    createBoard,
    getBoards
  }
})
