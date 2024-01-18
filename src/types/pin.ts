export type PinPreview = {
  id: number
  title: string
  url: string
  board_id: string | null
}

export type Pin = {
  id: string
  name: string
  image: string
  description: string
  link: string
  board_id: string | null
  user_id: string
  created_at: string
}
