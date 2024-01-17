import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

// upload image to storage
async function uploadImage(file: File) {
  if (!auth.user?.id) {
    throw new Error('You must be logged in to create a pin.')
  }
  const { error } = await supabase.storage
    .from(`created-pins/${auth.user.id}`)
    .upload(file.name, file)

  if (error) {
    console.error('Error uploading image:', error)
    throw error
  }
  console.log('Image uploaded successfully')
}

// create pin in db and upload image
// async function uploadAll() {
//   try {
//     const data = await createPin()
//     createdPinStore.addPin({
//       id: data?.[0].id,
//       title: data?.[0].name,
//       description: data?.[0].description,
//       link: data?.[0].link,
//       board_id: data?.[0].board_id,
//       image_url: data?.[0].image,
//       tags: data?.[0].tags,
//       created_at: data?.[0].created_at
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }

export type Pin = {
  title: string
  description: string
  link: string
  boardId: string | null
  file: File
  userId: string
}

export async function createPin(pinDetails: Pin) {
  const { data, error } = await supabase
    .from('created-pins')
    .insert([
      {
        name: pinDetails.title,
        description: pinDetails.description,
        link: pinDetails.link,
        board_id: pinDetails.boardId,
        user_id: pinDetails.userId,
        image: pinDetails.file.name,
        tags: JSON.stringify({})
      }
    ])
    .select('*')

  if (error) throw error

  // upload image to storage if pin was created successfully
  if (data) {
    console.log('after creating pin')
    console.log('data', data)
    await uploadImage(pinDetails.file)
  }

  return data
}

export async function createTag(tag: string) {
  try {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name: tag }])
      .select('id, name')

    if (error) {
      throw error
    }
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}
