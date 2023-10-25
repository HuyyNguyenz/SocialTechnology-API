import { Request } from 'express'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { FRIEND_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import Friend from '~/models/Friend'
import User from '~/models/User'
import { FriendStatus } from '~/types/friendTypes'
import { TokenPayload } from '~/types/userTypes'
import validate from '~/utils/validation'

const userIdSchema = {
  isNumeric: {
    errorMessage: FRIEND_MESSAGES.FRIEND_ID_MUST_BE_NUMBER
  },
  custom: {
    options: async (value: number) => {
      const user = new User()
      const sql = 'SELECT * FROM users WHERE id=?'
      const [userData] = await user.find(sql, [value])
      if (!userData) {
        throw new ErrorWithStatus({
          message: FRIEND_MESSAGES.FRIEND_ID_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      return true
    }
  }
}

export const addFriendValidator = validate(
  checkSchema(
    {
      friendId: userIdSchema,
      status: {
        isIn: {
          options: [FriendStatus.PENDING],
          errorMessage: FRIEND_MESSAGES.FRIEND_STATUS_IS_NOT_VALID
        }
      }
    },
    ['body']
  )
)

export const deleteFriendValidator = validate(
  checkSchema(
    {
      id: {
        isNumeric: {
          errorMessage: FRIEND_MESSAGES.ID_MUST_BE_NUMBER
        },
        custom: {
          options: async (value: number, { req }) => {
            const { userId } = (req as Request).decodedAccessToken as TokenPayload
            const friend = new Friend()
            const sql = 'SELECT * FROM friends WHERE id=? AND userId=? OR friendId=?'
            const [friendData] = await friend.find(sql, [value, userId, userId])
            if (!friendData) {
              throw new ErrorWithStatus({ message: FRIEND_MESSAGES.ID_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const acceptFriendValidator = validate(
  checkSchema(
    {
      id: {
        isNumeric: {
          errorMessage: FRIEND_MESSAGES.ID_MUST_BE_NUMBER
        },
        custom: {
          options: async (value: number, { req }) => {
            const { userId } = (req as Request).decodedAccessToken as TokenPayload
            const friend = new Friend()
            const sql = 'SELECT * FROM friends WHERE id=? AND friendId=?'
            const [friendData] = await friend.find(sql, [value, userId])
            if (!friendData) {
              throw new ErrorWithStatus({ message: FRIEND_MESSAGES.ID_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
