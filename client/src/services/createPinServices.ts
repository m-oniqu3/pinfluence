// import { supabase } from '@/lib/supabaseClient'
import { getBoardById } from '@/services/boardServices'
import { useAuthStore } from '@/stores/auth'
import type { BoardInfo } from '@/types/board'
import type { Owner } from '@/types/owner'
import type { UploadPin } from '@/types/pin'

const auth = useAuthStore()

// upload image to storage
async function uploadImage(file: File) {
  // if (!auth.user?.id) {
  //   throw new Error('You must be logged in to create a pin.')
  // }
  // const { error } = await supabase.storage
  //   .from(`created-pins/${auth.user.id}`)
  //   .upload(file.name, file)
  // if (error) {
  //   console.error('Error uploading image:', error)
  //   throw error
  // }
  // console.log('Image uploaded successfully')
}

export async function createPin(pinDetails: UploadPin) {
  // const { data, error } = await supabase
  //   .from('created-pins')
  //   .insert([
  //     {
  //       name: pinDetails.name,
  //       description: pinDetails.description,
  //       link: pinDetails.link,
  //       board_id: pinDetails.boardId,
  //       user_id: pinDetails.userId,
  //       image: pinDetails.file.name
  //     }
  //   ])
  //   .select('id, name, board_id, image')
  // if (error) throw error
  // // upload image to storage if pin was created successfully
  // if (data) {
  //   console.log('after creating pin')
  //   console.log('data', data)
  //   await uploadImage(pinDetails.file)
  // }
  // return data
}

export async function createTag(tag: string) {
  // try {
  //   const { data, error } = await supabase
  //     .from('tags')
  //     .insert([{ name: tag }])
  //     .select('id, name')
  //   if (error) {
  //     throw error
  //   }
  //   console.log(data)
  //   return data
  // } catch (error) {
  //   console.log(error)
  // }
}

export async function createPinTag(tags: { id: string; name: string }[], pinId: string) {
  // const { data, error } = await supabase
  //   .from('created-pins-tags')
  //   .insert(
  //     tags.map((tag) => {
  //       return { pin_id: pinId, tag_id: tag.id }
  //     })
  //   )
  //   .select('id')
  // if (error) {
  //   throw error
  // }
  // console.log('tags created successfully')
  // console.log(data)
}

export async function getPinDetails(id: number) {
  // try {
  //   const { data, error } = await supabase.from('created-pins').select('*').eq('id', id).single()
  //   if (error) {
  //     throw new Error(error.message)
  //   }
  //   return data as PinDetails
  // } catch (error) {
  //   console.log(error)
  // }
}

export async function getOwnerDetails(id: string) {
  // try {
  //   const { data, error } = await supabase
  //     .from('profiles')
  //     .select('id, full_name, avatar_url')
  //     .eq('id', id)
  //     .single()
  //   if (error) {
  //     throw new Error(error.message)
  //   }
  //   return data as Owner
  // } catch (error) {
  //   console.error(error)
  // }
}

// function to fetch additional details for a pin
export async function fetchExtraPinDetails(user_id: string, board_id: string | null) {
  const result = await Promise.allSettled([getOwnerDetails(user_id), getBoardById(board_id)])

  const [ownerDetails, boardDetails] = result.map((detail) =>
    detail.status === 'fulfilled' ? detail.value : null
  ) as [Owner, BoardInfo]

  return { ownerDetails, boardDetails }
}
