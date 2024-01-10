import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { useBoardStore } from '@/stores/board'
import type { Board } from '@/types/board'

type BoardData = {
  name: string
  secret: boolean
  user_id: string
}
export async function createBoard(boardData: BoardData) {
  const { data, error } = await supabase.from('boards').insert(boardData).single()

  return { data, error }
}

export async function getBoards() {
  const board = useBoardStore()
  const auth = useAuthStore()
  try {
    if (!auth.isAuth || !auth.user) throw new Error('Cannot get boards.')

    const { data, error } = await supabase
      .from('boards')
      .select('id, name, secret, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    board.setBoards(data as Board[])
  } catch (error) {
    console.log(error)
  }
}
