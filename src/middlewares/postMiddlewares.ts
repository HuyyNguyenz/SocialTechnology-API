import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import Post from '~/models/Post'
import User from '~/models/User'
import { TypePost, TypePostShare } from '~/types/postType'
import { enumObjectToArray } from '~/utils/common'
import validate from '~/utils/validation'

const typePostArray = enumObjectToArray(TypePost)
const typePostShareArray = enumObjectToArray(TypePostShare)

const userIdSchema = {
  isNumeric: {
    errorMessage: POST_MESSAGES.USER_ID_MUST_BE_NUMBER
  },
  custom: {
    options: async (value: number) => {
      const user = new User()
      const sql = 'SELECT * FROM users WHERE id=?'
      const [userData] = await user.find(sql, [value])
      if (!userData) {
        throw new ErrorWithStatus({ message: POST_MESSAGES.USER_ID_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
      }
      return true
    }
  }
}

export const createPostValidator = validate(
  checkSchema(
    {
      createdAt: {
        notEmpty: {
          errorMessage: POST_MESSAGES.CREATED_AT_IS_NOT_EMPTY
        },
        matches: {
          options: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
          errorMessage: POST_MESSAGES.CREATED_AT_IS_NOT_VALID
        }
      },
      userId: userIdSchema,
      communityId: {
        isNumeric: {
          errorMessage: POST_MESSAGES.COMMUNITY_ID_MUST_BE_NUMBER
        }
      },
      type: {
        isIn: {
          options: [typePostArray],
          errorMessage: POST_MESSAGES.TYPE_IS_NOT_VALID
        }
      }
    },
    ['body']
  )
)

export const sharePostValidator = validate(
  checkSchema(
    {
      userId: userIdSchema,
      postId: {
        isNumeric: {
          errorMessage: POST_MESSAGES.POST_ID_MUST_BE_NUMBER
        },
        custom: {
          options: async (value: number) => {
            const post = new Post()
            const sql = 'SELECT * FROM posts WHERE id=?'
            const [postData] = await post.find(sql, [value])
            if (!postData) {
              throw new ErrorWithStatus({ message: POST_MESSAGES.POST_ID_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            return true
          }
        }
      },
      type: {
        isIn: {
          options: [typePostShareArray],
          errorMessage: POST_MESSAGES.TYPE_POST_SHARE_IS_NOT_VALID
        }
      }
    },
    ['body']
  )
)
