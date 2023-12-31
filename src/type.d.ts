import { Request } from 'express'
import { TokenPayload, UserType } from './types/userTypes'

declare module 'express' {
  interface Request {
    user?: UserType
    decodedRefreshToken?: TokenPayload
    decodedAccessToken?: TokenPayload
    authorId?: number
    friend?: UserType
  }
}
