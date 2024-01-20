export type PinPreview = {
  id: number
  title: string
  url: string
  board_id: string | null
}

export type PinDetails = {
  id: number
  name: string
  image: string
  description: string
  link: string
  board_id: string | null
  user_id: string
  created_at: string
}

export type CreatedPin = {
  id: number
  title: string
  description: string
  image_url: string
  created_at: string
  board_id: string | null
  link: string
}
