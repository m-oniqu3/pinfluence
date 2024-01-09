import { supabase } from '@/lib/supabaseClient'

type BoardData = {
  name: string
  secret: boolean
  user_id: string
}
export async function createBoard(boardData: BoardData) {
  const { data, error } = await supabase.from('boards').insert(boardData).single()

  return { data, error }
}
