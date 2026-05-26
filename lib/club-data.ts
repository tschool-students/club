export interface Club {
  id: string
  name: string
  description: string
  charterUrl?: string
  socialMedia: {
    platform: string
    url: string
  }[]
  officers: {
    role: string
    name: string
  }[]
  coverImage?: string
  gallery?: string[]
  category: string
}
