import { ParamsDictionary, Query } from 'express-serve-static-core'
export interface VerifyReqBody {
  username: string
}

export interface VerifyEmailReqBody {
  email: string
}

export interface RecoveryPasswordReqBody {
  password: string
}

export interface RecoveryPasswordReqParam extends ParamsDictionary {
  email: string
}

export interface SearchReqQuery extends Pagination, Query {
  value: string
}

export interface Pagination {
  limit: string
  page: string
}

export interface UpdateProfileReqBody {
  firstName?: string
  lastName?: string
  birthDay?: string
  gender?: string
  avatar?: string
  backgroundImage?: string
}

export interface UserIdReqParam extends ParamsDictionary {
  userId: string
}

export interface PostIdReqParam extends ParamsDictionary {
  id: string
}

export interface SharePostReqBody {
  postId: number
  type: string
}

export interface LikePostReqBody extends SharePostReqBody {
  receiverId: number
}

export interface UpdatePostReqBody {
  modifiedAt: string
  communityId: string
  content?: string
  images?: any
  video?: any
  type?: string
}

export interface CommentReqParam extends ParamsDictionary {
  id: string
}

export interface UpdateCommentReqBody {
  modifiedAt: string
  content?: string
  images?: any
  video?: any
}

export interface UpdateMessageReqBody {
  modifiedAt: string
  content?: string
  images?: any
  video?: any
}
