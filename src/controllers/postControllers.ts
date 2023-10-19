import axios from 'axios'
import { Response, Request } from 'express'
import postService from '~/services/postService'
import { ParamsDictionary } from 'express-serve-static-core'
import { Pagination, PostIdReqParam, SharePostReqBody, UserIdReqParam } from '~/requestTypes'
import { PostType } from '~/types/postType'
import HTTP_STATUS from '~/constants/httpStatus'

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
  getLikesPost: async (req: Request<PostIdReqParam>, res: Response) => {
    const { id } = req.params
    const result = await postService.handleGetLikesPost(Number(id))
    res.json(result)
  },
  addPost: async (req: Request<ParamsDictionary, any, PostType>, res: Response) => {
    const result = await postService.handleAddPost(req.body)
    res.status(HTTP_STATUS.CREATED).json(result)
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
    return res.json(result)
  },
  sharePost: async (req: Request<ParamsDictionary, any, SharePostReqBody>, res: Response) => {
    const { userId, postId, type } = req.body
    const result = await postService.handleSharePost(userId, postId, type)
    return res.status(HTTP_STATUS.CREATED).json(result)
  },
  getSharesPost: async (req: Request<PostIdReqParam>, res: Response) => {
    const { id } = req.params
    const result = await postService.handleGetSharesPost(Number(id))
    res.json(result)
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
