import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import md5 from 'md5'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import ErrorWithStatus from '~/models/Error'
import User from '~/models/User'
import { Gender, TokenPayload, UserType } from '~/types/userType'
import validate from '~/utils/validation'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { verifyToken } from '~/utils/jwt'

config()
const emailSchema = {
  isEmail: true,
  trim: true,
  errorMessage: USER_MESSAGES.EMAIL_IS_NOT_VALID
}
const passwordSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGES.PASSWORD_IS_NOT_EMPTY
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1
    },
    errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
  },
  isLength: {
    options: {
      min: 6,
      max: 32
    },
    errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}

export const registerValidator = validate(
  checkSchema(
    {
      email: emailSchema,
      password: passwordSchema,
      firstName: {
        notEmpty: { errorMessage: USER_MESSAGES.FIRST_NAME_IS_NOT_EMPTY },
        isString: {
          errorMessage: USER_MESSAGES.FIRST_NAME_MUST_BE_STRING
        },
        trim: true
      },
      lastName: {
        notEmpty: { errorMessage: USER_MESSAGES.LAST_NAME_IS_NOT_EMPTY },
        isString: {
          errorMessage: USER_MESSAGES.LAST_NAME_MUST_BE_STRING
        },
        trim: true
      },
      birthDay: {
        notEmpty: {
          errorMessage: USER_MESSAGES.BIRTHDAY_IS_NOT_EMPTY
        },
        isDate: {
          options: {
            format: 'DD/MM/YYYY'
          },
          errorMessage: USER_MESSAGES.BIRTHDAY_IS_NOT_VALID
        }
      },
      createdAt: {
        notEmpty: {
          errorMessage: USER_MESSAGES.CREATED_AT_IS_NOT_EMPTY
        },
        isDate: {
          options: {
            format: 'DD/MM/YYYY'
          },
          errorMessage: USER_MESSAGES.CREATED_AT_IS_NOT_VALID
        }
      },
      gender: {
        notEmpty: {
          errorMessage: USER_MESSAGES.GENDER_IS_NOT_EMPTY
        },
        custom: {
          options: (value: Gender, { req }) => {
            if (![Gender.MALE, Gender.FEMALE].includes(value)) {
              throw new Error(USER_MESSAGES.GENDER_IS_NOT_VALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const usernameValidator = validate(
  checkSchema(
    {
      username: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (value === '') {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.USERNAME_IS_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const user = new User()
            const sql = 'SELECT * FROM users WHERE username=?'
            const [userData] = await user.find(sql, [value])
            if (!userData) {
              throw new ErrorWithStatus({ message: USER_MESSAGES.USERNAME_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            ;(req as Request).user = userData
            return true
          }
        }
      }
    },
    ['body', 'params']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = new User()
            const hashPassword = md5(req.body.password)
            const sql = 'SELECT * FROM users WHERE email=? AND password=?'
            const values = [value, hashPassword]
            const [userData] = await user.find(sql, values)
            if (!userData) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).user = userData
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_IS_NOT_EMPTY
        }
      }
    },
    ['body']
  )
)

export const verifiedUser = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as UserType
  if (user && user.verify === 'true') {
    return next()
  }
  return res.status(HTTP_STATUS.FORBIDDEN).json({
    message: USER_MESSAGES.EMAIL_NOT_VERIFY
  })
}

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        custom: {
          options: async (value: string, { req }) => {
            const user = new User()
            const sql = 'SELECT * FROM users WHERE token=?'
            const [userData] = await user.find(sql, [value])
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.REFRESH_TOKEN_IS_NOT_EMPTY,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            if (!userData) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.REFRESH_TOKEN_IS_NOT_EXISTS,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            try {
              const decodedRefreshToken = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.REFRESH_TOKEN_KEY as string
              })
              ;(req as Request).decodedRefreshToken = decodedRefreshToken
              return true
            } catch (error) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.REFRESH_TOKEN_IS_NOT_VALID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
          }
        }
      }
    },
    ['body']
  )
)

export const verifyEmailValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = new User()
            const sql = 'SELECT * FROM users WHERE email=?'
            const [userData] = await user.find(sql, [value])
            if (!userData) {
              throw new ErrorWithStatus({ message: USER_MESSAGES.EMAIL_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            ;(req as Request).user = userData
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyOtpValidator = validate(
  checkSchema(
    {
      otpCode: {
        notEmpty: {
          errorMessage: USER_MESSAGES.OTP_CODE_IS_NOT_EMPTY
        },
        custom: {
          options: async (value: string, { req }) => {
            const user = new User()
            const sql = 'SELECT * FROM users WHERE otpCode=? AND email=?'
            const values = [value, req.body.email]
            const [userData] = await user.find(sql, values)
            if (!userData) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.OTP_CODE_IS_NOT_CORRECT,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            ;(req as Request).user = userData
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const recoveryPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema
    },
    ['body']
  )
)

export const verifyTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const token = value.split(' ')[1]
            if (!token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decodedAccessToken = await verifyToken({
                token,
                secretOrPublicKey: process.env.ACCESS_TOKEN_KEY as string
              })
              ;(req as Request).decodedAccessToken = decodedAccessToken
              return true
            } catch (error) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_NOT_VALID,
                status: HTTP_STATUS.FORBIDDEN
              })
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: async (value, { req }) => {
            const num = Number(value)
            if (num > 100 || num < 1) {
              throw new Error('1 <= limit <= 100')
            }
            return true
          }
        }
      },
      page: {
        isNumeric: true,
        custom: {
          options: async (value, { req }) => {
            const num = Number(value)
            if (num < 1) {
              throw new Error('page >= 1')
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
