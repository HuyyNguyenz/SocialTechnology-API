import { ParamsDictionary } from 'express-serve-static-core'

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
