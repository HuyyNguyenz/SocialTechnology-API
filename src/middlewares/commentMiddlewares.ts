import { Request } from 'express'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { COMMENT_MESSAGES, POST_MESSAGES } from '~/constants/messages'
import Comment from '~/models/Comment'
import { ErrorWithStatus } from '~/models/Error'
import Post from '~/models/Post'
import validate from '~/utils/validation'

const commentIdSchema = {
  isNumeric: {
    errorMessage: COMMENT_MESSAGES.COMMENT_ID_MUST_BE_NUMBER
  },
  custom: {
    options: async (value: number) => {
      const comment = new Comment()
      const sql = 'SELECT * FROM comments WHERE id=? AND deleted=0'
      const [commentData] = await comment.find(sql, [value])
      if (!commentData) {
        throw new ErrorWithStatus({
          message: COMMENT_MESSAGES.COMMENT_ID_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      return true
    }
  }
}

export const createCommentValidator = validate(
  checkSchema(
    {
      createdAt: {
        notEmpty: {
          errorMessage: COMMENT_MESSAGES.CREATED_AT_IS_NOT_EMPTY
        },
        matches: {
          options: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
          errorMessage: COMMENT_MESSAGES.CREATED_AT_IS_NOT_VALID
        }
      },
      postId: {
        isNumeric: {
          errorMessage: POST_MESSAGES.POST_ID_MUST_BE_NUMBER
        },
        custom: {
          options: async (value: number, { req }) => {
            const post = new Post()
            const sql = 'SELECT * FROM posts WHERE id=?'
            const [postData] = await post.find(sql, [value])
            if (!postData) {
              throw new ErrorWithStatus({ message: POST_MESSAGES.POST_ID_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            ;(req as Request).authorId = Number(postData.userId)
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const deleteCommentValidator = validate(
  checkSchema(
    {
      id: commentIdSchema
    },
    ['params']
  )
)

export const updateCommentValidator = validate(
  checkSchema(
    {
      id: commentIdSchema,
      modifiedAt: {
        notEmpty: {
          errorMessage: COMMENT_MESSAGES.MODIFIED_AT_IS_NOT_EMPTY
        },
        matches: {
          options: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
          errorMessage: COMMENT_MESSAGES.MODIFIED_AT_IS_NOT_VALID
        }
      }
    },
    ['body', 'params']
  )
)
