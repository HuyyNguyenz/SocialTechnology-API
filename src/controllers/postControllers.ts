import axios from 'axios'
import { Response, Request } from 'express'
import postService from '~/services/postService'
import { ParamsDictionary } from 'express-serve-static-core'
import { Pagination, PostIdReqParam, UserIdReqParam } from '~/requestTypes'

const postController = {
  getPostList: async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
    const { limit, page } = req.query
    const result = await postService.handleGetPostList(Number(limit), Number(page))
    result.length > 0 &&
      Array.from(result).forEach((post: any) => {
        if (post.images) {
          const images = JSON.parse(post.images)
          post.images = images
        }
        if (post.video) {
          const video = JSON.parse(post.video)
          post.video = video
        }
      })
    res.json(result)
  },
  getPostListByUser: async (req: Request<UserIdReqParam, any, any, Pagination>, res: Response) => {
    const { userId } = req.params
    const { limit, page } = req.query
    const result = await postService.handleGetPostListByUser(Number(userId), Number(limit), Number(page))
    result.length > 0 &&
      Array.from(result).forEach((post: any) => {
        if (post.images) {
          const images = JSON.parse(post.images)
          post.images = images
        }
        if (post.video) {
          const video = JSON.parse(post.video)
          post.video = video
        }
      })
    res.json(result)
  },
  getPostDetail: async (req: Request<PostIdReqParam>, res: Response) => {
    const { id } = req.params
    const result = await postService.handleGetPostDetail(Number(id))
    result.length > 0 &&
      Array.from(result).forEach((post: any) => {
        if (post.images) {
          const images = JSON.parse(post.images)
          post.images = images
        }
        if (post.video) {
          const video = JSON.parse(post.video)
          post.video = video
        }
      })
    res.json(result)
  },
  getLikesPost: async (req: Request, res: Response) => {
    const { postId } = req.params
    if (postId) {
      const result = await postService.handleGetLikesPost(Number(postId))
      res.status(200).json(result)
    }
  },
  addPost: async (req: Request, res: Response) => {
    const { createdAt } = req.body
    if (createdAt) {
      const result = await postService.handleAddPost(req.body)
      res.status(result.status).json(result)
    }
  },
  likePost: async (req: Request, res: Response) => {
    const { userId, postId, type, receiverId } = req.body
    if (userId && postId && type === 'like' && receiverId) {
      const result = await postService.handleLikePost(userId, postId, type, receiverId)
      res.status(result.status).json(result)
    }
  },
  deletePost: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
      const result = await postService.handleDeletePost(Number(id))
      res.status(result.status).json(result)
    }
  },
  deleteLikePost: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
      const result = await postService.handleUnlikePost(Number(id))
      res.status(result.status).json(result)
    }
  },
  updatePost: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
      const result = await postService.handleUpdatePost(Number(id), req.body)
      res.status(result.status).json(result)
    }
  },
  getLikes: async (req: Request, res: Response) => {
    const result = await postService.handleGetLikes()
    res.status(200).json(result)
  },
  sharePost: async (req: Request, res: Response) => {
    const { userId, postId, type } = req.body
    if (userId && postId && type) {
      const result = await postService.handleSharePost(userId, postId, type)
      res.status(result.status).json(result)
    }
  },
  getSharesPost: async (req: Request, res: Response) => {
    const { postId } = req.params
    if (postId) {
      const result = await postService.handleGetSharesPost(Number(postId))
      res.status(200).json(result)
    }
  },
  getArticle: async (req: Request, res: Response) => {
    const { link } = req.query
    try {
      const data = (await axios.get(link as string)).data
      res.status(200).json(data)
    } catch (error) {
      res.status(404).json({ message: 'Lỗi' })
    }
  }
}

export default postController
