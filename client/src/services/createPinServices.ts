// import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

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
// export async function fetchExtraPinDetails(user_id: string, board_id: string | null) {
//   const result = await Promise.allSettled([getOwnerDetails(user_id), getBoardById(board_id)])

//   const [ownerDetails, boardDetails] = result.map((detail) =>
//     detail.status === 'fulfilled' ? detail.value : null
//   ) as [Owner, BoardInfo]

//   return { ownerDetails, boardDetails }
// }
