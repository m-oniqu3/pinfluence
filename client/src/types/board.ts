export type Board = {
  id: number
  name: string
  secret: boolean
  created_at: string
  user_id: string
  image?: string
  description?: string
}

export type NewBoard = Pick<Board, 'name' | 'secret'>

export type BoardInfo = Pick<Board, 'id' | 'name'>

export type BoardOwnerProfile = {
  user: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  board: {
    id: number
    name: string
    secret: boolean
    description?: string
  }
}
