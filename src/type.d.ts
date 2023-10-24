import { Request } from 'express'
import { TokenPayload, UserType } from './types/userType'

declare module 'express' {
  interface Request {
    user?: UserType
    decodedRefreshToken?: TokenPayload
    decodedAccessToken?: TokenPayload
    authorId?: number
  }
}
