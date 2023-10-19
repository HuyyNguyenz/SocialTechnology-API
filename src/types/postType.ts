export interface PostType {
  createdAt: string
  userId: number
  communityId: number
  type: TypePost
  id?: number
  content?: string
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

export enum TypePost {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export enum TypePostShare {
  EVERYONE = 'share',
  FRIEND = 'shareTo'
}
