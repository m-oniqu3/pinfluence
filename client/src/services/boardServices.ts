// import { supabase } from '@/lib/supabaseClient'

type BoardData = {
  name: string
  secret: boolean
  user_id: string
}
async function createBoard(boardData: BoardData) {
  // const { data, error } = await supabase.from('boards').insert(boardData).single()
  // return { data, error }
}

async function getBoards() {
  // const board = useBoardStore()
  // const auth = useAuthStore()
  // try {
  //   if (!auth.isAuth || !auth.user) throw new Error('Cannot get boards.')
  //   const { data, error } = await supabase
  //     .from('boards')
  //     .select('id, name, secret, created_at')
  //     .order('created_at', { ascending: false })
  //   if (error) throw error
  //   board.setBoards(data as Board[])
  // } catch (error) {
  //   console.log(error)
  // }
}

export async function getBoardById(id: string | null) {
  // // if no id, early return
  // if (!id) return null
  // const { data, error } = await supabase.from('boards').select('id, name').eq('id', id).single()
  // if (error) throw error
  // return data as BoardInfo
}
