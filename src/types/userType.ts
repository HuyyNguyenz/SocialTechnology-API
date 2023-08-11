export interface UserType {
  email: string
  password: string
  firstName: string
  lastName: string
  birthDay: string
  gender: string
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

export interface LoginData {
  email: string
  password: string
}
