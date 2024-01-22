export type Profile = {
  firstName: string
  lastName: string
  username: string
  website: string
  avatar_url: string
  about: string
}

export type ProfileData = Omit<Profile, 'firstName' | 'lastName'> & {
  full_name: string
}
