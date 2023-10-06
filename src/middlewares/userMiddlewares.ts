import { checkSchema } from 'express-validator'
import { USER_MESSAGES } from '~/constants/messages'
import { Gender } from '~/types/userType'
import validate from '~/utils/validation'

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        trim: true,
        errorMessage: USER_MESSAGES.EMAIL_IS_NOT_VALID
      },
      password: {
        isEmpty: false,
        errorMessage: USER_MESSAGES.PASSWORD_IS_NOT_EMPTY,
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
      },
      firstName: {
        isString: true,
        trim: true,
        errorMessage: USER_MESSAGES.FIRST_NAME_MUST_BE_STRING
      },
      lastName: {
        isString: true,
        trim: true,
        errorMessage: USER_MESSAGES.LAST_NAME_MUST_BE_STRING
      },
      birthDay: {
        isEmpty: false,
        errorMessage: USER_MESSAGES.BIRTHDAY_IS_NOT_EMPTY,
        isDate: {
          options: {
            format: 'DD/MM/YYYY'
          },
          errorMessage: USER_MESSAGES.BIRTHDAY_IS_NOT_VALID
        }
      },
      createdAt: {
        isEmpty: false,
        errorMessage: USER_MESSAGES.CREATED_AT_IS_NOT_EMPTY,
        isDate: {
          options: {
            format: 'DD/MM/YYYY'
          },
          errorMessage: USER_MESSAGES.CREATED_AT_IS_NOT_VALID
        }
      },
      gender: {
        custom: {
          options: (value, { req }) => {
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
