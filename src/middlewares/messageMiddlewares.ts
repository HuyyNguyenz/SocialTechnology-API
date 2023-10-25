import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { MESSAGE_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import Friend from '~/models/Friend'
import Message from '~/models/Message'
import User from '~/models/User'
import { TokenPayload } from '~/types/userTypes'
import wrapRequestHandler from '~/utils/handlers'
import validate from '~/utils/validation'

const messageIdSchema = {
  isNumeric: {
    errorMessage: MESSAGE_MESSAGES.MESSAGE_ID_MUST_BE_NUMBER
  },
  custom: {
    options: async (value: number, { req }: any) => {
      const { userId } = (req as Request).decodedAccessToken as TokenPayload
      const message = new Message()
      const sql = 'SELECT * FROM messages WHERE id=? AND userId=? AND deleted=?'
      const [messageData] = await message.find(sql, [value, userId, 0])
      if (!messageData) {
        throw new ErrorWithStatus({
          message: MESSAGE_MESSAGES.MESSAGE_ID_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      return true
    }
  }
}

export const createMessageValidator = validate(
  checkSchema(
    {
      createdAt: {
        notEmpty: {
          errorMessage: MESSAGE_MESSAGES.CREATED_AT_IS_NOT_EMPTY
        },
        matches: {
          options: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
          errorMessage: MESSAGE_MESSAGES.CREATED_AT_IS_NOT_VALID
        }
      },
      friendId: {
        isNumeric: {
          errorMessage: MESSAGE_MESSAGES.FRIEND_ID_MUST_BE_NUMBER
        },
        custom: {
          options: async (value: number, { req }) => {
            const user = new User()
            const sql = 'SELECT * FROM users WHERE id=?'
            const [userData] = await user.find(sql, [value])
            if (!userData) {
              throw new ErrorWithStatus({
                message: MESSAGE_MESSAGES.FRIEND_ID_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).friend = userData
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const checkFriendStatus = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decodedAccessToken as TokenPayload
  const friend = new Friend()
  const sql = 'SELECT * FROM friends WHERE friendId=? AND userId=? AND status=?'
  const values = [Number(req.body.friendId), userId, 'accept']
  const [friendData] = await friend.find(sql, values)
  if (!friendData) {
    throw new ErrorWithStatus({ message: MESSAGE_MESSAGES.FRIEND_IS_NOT_EXISTS, status: HTTP_STATUS.BAD_REQUEST })
  }
  return next()
})

export const deleteMessageValidator = validate(
  checkSchema(
    {
      id: messageIdSchema
    },
    ['params']
  )
)

export const updateMessageValidator = validate(
  checkSchema(
    {
      id: messageIdSchema,
      modifiedAt: {
        notEmpty: {
          errorMessage: MESSAGE_MESSAGES.MODIFIED_AT_IS_NOT_EMPTY
        },
        matches: {
          options: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
          errorMessage: MESSAGE_MESSAGES.MODIFIED_AT_IS_NOT_VALID
        }
      }
    },
    ['body', 'params']
  )
)
