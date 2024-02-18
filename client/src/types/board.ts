export type Board = {
  id: number
  name: string
  secret: boolean
  created_at: string
  image?: string
  description?: string
}

export type NewBoard = Pick<Board, 'name' | 'secret'>

export type BoardInfo = Pick<Board, 'id' | 'name'>
