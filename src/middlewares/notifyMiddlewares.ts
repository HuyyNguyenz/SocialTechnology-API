import { Request } from 'express'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { NOTIFY_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import Notify from '~/models/Notify'
import { TokenPayload } from '~/types/userTypes'
import validate from '~/utils/validation'

export const updateNotifyValidator = validate(
  checkSchema(
    {
      id: {
        isNumeric: {
          errorMessage: NOTIFY_MESSAGES.NOTIFY_ID_MUST_BE_NUMBER
        },
        custom: {
          options: async (value: number, { req }) => {
            const { userId } = (req as Request).decodedAccessToken as TokenPayload
            const notify = new Notify()
            const sql = 'SELECT * FROM notifies WHERE id=? AND receiverId=?'
            const [notifyData] = await notify.find(sql, [value, userId])
            if (!notifyData) {
              throw new ErrorWithStatus({
                message: NOTIFY_MESSAGES.NOTIFY_ID_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
