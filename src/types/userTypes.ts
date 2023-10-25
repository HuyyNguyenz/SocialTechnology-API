import { SignOptions } from 'jsonwebtoken'

export interface UserType {
  email: string
  password: string
  firstName: string
  lastName: string
  birthDay: string
  gender: Gender
  createdAt: string
  id?: string
  username?: string
  token?: string
  socketId?: string
  avatar?: { name: string; url: string }
  backgroundImage?: { name: string; url: string }
  verify?: string
  otpCode?: string
  isOnline?: string
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export interface TokenPayload {
  userId: number
  iat: number
  exp: number
}

export interface JwtType {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}
