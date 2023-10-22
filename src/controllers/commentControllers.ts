import { Request, Response } from 'express'
import commentService from '~/services/commentService'

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
    res.status(200).json(result)
  },
  getCommentListByPost: async (req: Request, res: Response) => {
    const { postId, limit, offset } = req.params
    if (postId) {
      const result = await commentService.handleGetCommentListByPost(Number(postId), Number(limit), Number(offset))
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
      res.status(200).json(result)
    }
  },
  addComment: async (req: Request, res: Response) => {
    const { createdAt } = req.body
    if (createdAt) {
      const result = await commentService.handleAddComment(req.body)
      res.status(result.status).json(result)
    }
  },
  deleteComment: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
      const result = await commentService.handleDeleteComment(Number(id))
      res.status(result.status).json(result)
    }
  },
  updateComment: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
      const result = await commentService.handleUpdateComment(Number(id), req.body)
      res.status(result.status).json(result)
    }
  }
}

export default commentController
