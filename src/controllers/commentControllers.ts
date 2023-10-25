import { Request, Response } from 'express'
import commentService from '~/services/commentServices'
import { ParamsDictionary } from 'express-serve-static-core'
import { CommentReqParam, Pagination, UpdateCommentReqBody } from '~/requestTypes'
import HTTP_STATUS from '~/constants/httpStatus'
import { CommentType } from '~/types/commentTypes'
import { TokenPayload } from '~/types/userTypes'

const commentController = {
  getCommentList: async (req: Request, res: Response) => {
    const result = await commentService.handleGetCommentList()
    result.length > 0 &&
      Array.from(result).forEach((comment: any) => {
        if (comment.images) {
          const images = JSON.parse(comment.images)
          comment.images = images
        }
        if (comment.video) {
          const video = JSON.parse(comment.video)
          comment.video = video
        }
      })
    return res.json(result)
  },
  getCommentListByPost: async (req: Request<CommentReqParam, any, any, Pagination>, res: Response) => {
    const { id } = req.params
    const { limit, page } = req.query
    const result = await commentService.handleGetCommentListByPost({
      id: Number(id),
      limit: Number(limit),
      page: Number(page)
    })
    result.length > 0 &&
      Array.from(result).forEach((comment: any) => {
        if (comment.images) {
          const images = JSON.parse(comment.images)
          comment.images = images
        }
        if (comment.video) {
          const video = JSON.parse(comment.video)
          comment.video = video
        }
      })
    return res.json(result)
  },
  addComment: async (req: Request<ParamsDictionary, any, CommentType>, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const authorId = Number(req.authorId)
    const result = await commentService.handleAddComment(userId, req.body, authorId)
    return res.status(HTTP_STATUS.CREATED).json(result)
  },
  deleteComment: async (req: Request, res: Response) => {
    const { id } = req.params
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await commentService.handleDeleteComment(Number(id), userId)
    return res.json(result)
  },
  updateComment: async (req: Request<CommentReqParam, any, UpdateCommentReqBody>, res: Response) => {
    const { id } = req.params
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await commentService.handleUpdateComment(Number(id), req.body, userId)
    return res.json(result)
  }
}

export default commentController
