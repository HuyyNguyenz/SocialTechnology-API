import { Request } from 'express'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import ExtraPost from '~/models/ExtraPost'
import Post from '~/models/Post'
import User from '~/models/User'
import { TypePost, TypePostShare } from '~/types/postType'
import { TokenPayload } from '~/types/userType'
import { enumObjectToArray } from '~/utils/common'
import validate from '~/utils/validation'

const typePostArray = enumObjectToArray(TypePost)
const typePostShareArray = enumObjectToArray(TypePostShare)

const postIdSchema = {
  isNumeric: {
    errorMessage: POST_MESSAGES.POST_ID_MUST_BE_NUMBER
  },
  custom: {
    options: async (value: number) => {
      const post = new Post()
      const sql = 'SELECT * FROM posts WHERE id=? AND deleted=0'
      const [postData] = await post.find(sql, [value])
      if (!postData) {
        throw new ErrorWithStatus({ message: POST_MESSAGES.POST_ID_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
      }
      return true
    }
  }
}
const communityIdSchema = {
  isNumeric: {
    errorMessage: POST_MESSAGES.COMMUNITY_ID_MUST_BE_NUMBER
  }
}
const typePostSchema = {
  isIn: {
    options: [typePostArray],
    errorMessage: POST_MESSAGES.TYPE_IS_NOT_VALID
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
      communityId: communityIdSchema,
      type: typePostSchema
    },
    ['body']
  )
)

export const sharePostValidator = validate(
  checkSchema(
    {
      postId: postIdSchema,
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

export const likePostValidator = validate(
  checkSchema(
    {
      postId: postIdSchema,
      type: {
        isString: {
          errorMessage: POST_MESSAGES.TYPE_POST_LIKE_MUST_BE_STRING
        },
        custom: {
          options: (value: string) => {
            if (value !== 'like') {
              throw new Error(POST_MESSAGES.TYPE_POST_LIKE_IS_NOT_VALID)
            }
            return true
          }
        }
      },
      receiverId: {
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
    },
    ['body']
  )
)

export const deletePostValidator = validate(
  checkSchema(
    {
      id: postIdSchema
    },
    ['params']
  )
)

export const unLikeValidator = validate(
  checkSchema(
    {
      id: {
        custom: {
          options: async (value: number) => {
            const ep = new ExtraPost()
            const sql = 'SELECT * FROM feature_extra_posts WHERE id=?'
            const [epData] = await ep.find(sql, [value])
            if (!epData) {
              throw new ErrorWithStatus({
                message: POST_MESSAGES.ID_LIKE_POST_IS_NOT_FOUND,
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

export const updatePostValidator = validate(
  checkSchema(
    {
      id: {
        custom: {
          options: async (value: number, { req }) => {
            const { userId } = (req as Request).decodedAccessToken as TokenPayload
            const post = new Post()
            const sql = 'SELECT * FROM posts WHERE id=? AND userId=?'
            const [postData] = await post.find(sql, [value, userId])
            if (!postData) {
              throw new ErrorWithStatus({ message: POST_MESSAGES.POST_ID_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            return true
          }
        }
      },
      modifiedAt: {
        notEmpty: {
          errorMessage: POST_MESSAGES.MODIFIED_AT_IS_NOT_EMPTY
        },
        matches: {
          options: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
          errorMessage: POST_MESSAGES.MODIFIED_AT_IS_NOT_VALID
        }
      },
      type: {
        ...typePostSchema,
        optional: true,
        notEmpty: false
      }
    },
    ['body', 'params']
  )
)
