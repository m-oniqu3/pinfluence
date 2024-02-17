export type PinPreview = {
  id: number
  name: string
  image: string
  user_id?: string
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
  name: string
  description: string
  image: string
  created_at: string
  board_id: string | null
  link: string
}

export type UploadPin = {
  name: string
  description: string
  link: string
  boardId: string | null
  file: File
}
