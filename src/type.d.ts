import { Request } from 'express'
import { UserType } from './types/userType'

declare module 'express' {
  interface Request {
    user?: UserType
  }
}
