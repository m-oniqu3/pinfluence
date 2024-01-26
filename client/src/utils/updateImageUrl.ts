/**
 * @param {string} input - The image url
 * @param {string} user_id - The user id
 * @returns {string} - The updated image url
 * @description
 * This function checks if the image is from Pexels or user-uploaded.
 * If it's from Pexels, it returns the existing Pexels image URL.
 * If it's user-uploaded, it constructs the URL using user ID and image name.
 *
 */

export function updateImageUrl(input: string, user_id: string) {
  let imageUrl

  if (input.startsWith('https://images.pexels.com')) {
    imageUrl = input
  } else {
    const url = import.meta.env.VITE_SUPABASE_STORAGE_URL
    const src = url + '/created-pins/' + user_id
    imageUrl = src + '/' + input
  }

  return imageUrl
}
