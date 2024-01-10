export interface Board {
  id: string
  name: string
  description?: string
  created_at: string
  secret: boolean
}

export interface NewBoard {
  name: string
  description?: string
  secret: boolean
}
