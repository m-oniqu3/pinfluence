import pexelsClient from '@/lib/pexelsClient'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import type { PexelsResponse } from '@/types/pexels'

const auth = useAuthStore()
export async function populateCreatedPins() {
  try {
    const response = (await pexelsClient.photos.curated({
      per_page: 35,
      page: 3
    })) as unknown as PexelsResponse

    if (!response.photos) {
      throw new Error('No photos found')
    }

    if (auth.user === null) {
      return
    }

    // Insert Pexels images into Supabase "created_pins" table
    await Promise.all(
      response.photos.map(async (record) => {
        const insertData = {
          user_id: auth.user?.id,
          name: record.photographer,
          board_id: null,
          description: `Photo by ${record.photographer} on Pexels`,
          link: record.url,
          image: record.src.original
        }

        // Insert data into Supabase "created-pins" table
        const { data: insertedData, error } = await supabase
          .from('created-pins')
          .upsert([insertData])

        if (error) {
          throw new Error(`Error inserting pin: ${error.message}`)
        } else {
          console.log('pin inserted successfully:', insertedData)
        }
      })
    )
  } catch (error) {
    console.log(error)
  }
}

// fetch(pexelsEndpoint, { headers })
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`)
//     }
//     return response.json()
//   })
//   .then((data) => {
//     const images = data.photos as any

//     console.log(images)

//     // Insert Pexels images into Supabase "created_pins" table
//     // images.forEach(async (image) => {
//     //   const insertData = {
//     //     user_id: 'user_id_here', // Replace with the actual user ID
//     //     title: image.title,
//     //     description: image.description,
//     //     image_url: image.src.original
//     //     // Add other relevant fields
//     //   }

//     //   // Insert data into Supabase "created_pins" table
//     //   const { data: insertedData, error } = await supabase
//     //     .from('created_pins')
//     //     .upsert([insertData], { onConflict: ['user_id', 'image_url'] })

//     //   if (error) {
//     //     console.error('Error inserting image:', error)
//     //   } else {
//     //     console.log('Image inserted successfully:', insertedData)
//     //   }
//     // })
//   })
//   .catch((error) => {
//     console.error('Failed to fetch images from Pexels:', error.message)
//   })
