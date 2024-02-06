export type Profile = {
  full_name: string
  username: string
  website: string
  avatar_url: string
  about: string
  id: string
}

export type ProfileData = Omit<Profile, 'firstName' | 'lastName'> & {
  full_name: string
}
