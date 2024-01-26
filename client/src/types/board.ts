export type BoardOverview = {
  id: number
  name: string
  secret: boolean
  created_at: string
  image?: string
  description?: string
}

export type Board = Pick<BoardOverview, 'id' | 'name' | 'secret' | 'created_at'>

export type NewBoard = Pick<BoardOverview, 'name' | 'secret'>

export type BoardInfo = Pick<BoardOverview, 'id' | 'name'>
