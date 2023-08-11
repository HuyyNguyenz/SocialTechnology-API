export interface PostType {
  content: string
  createdAt: string
  userId: number
  communityId: number
  type: string
  id?: number
  modifiedAt?: string
  images?: FilePreview[]
  video?: FilePreview
}

export interface FilePreview {
  id: string
  name: string
  src: string
  origin?: File
  url?: string
}
