export type PinPreview = {
  id: number
  name: string
  image: string
  user_id?: string
}

export type SavedPinPreview = {
  pins: PinPreview[]
  count: number
}

export type SavedPinBoard = {
  pins: {
    id: number
    pin: PinPreview
  }
  count: number
}

export type PinDetails = {
  id: number
  name: string
  image: string
  description: string
  link: string
  user_id: string
  created_at: string

  user: {
    id: string
    full_name: string
    avatar_url: string
  }
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
