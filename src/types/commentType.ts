export interface CommentType {
  content: string
  createdAt: string
  userId: number
  postId: number
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
