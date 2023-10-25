import axios from 'axios'
import { Response, Request } from 'express'
import postService from '~/services/postServices'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  LikePostReqBody,
  Pagination,
  PostIdReqParam,
  SharePostReqBody,
  UpdatePostReqBody,
  UserIdReqParam
} from '~/requestTypes'
import { PostType } from '~/types/postTypes'
import HTTP_STATUS from '~/constants/httpStatus'
import { TokenPayload } from '~/types/userTypes'

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
    return res.json(result)
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
    res.json(result[0])
  },
  getLikesPost: async (req: Request<PostIdReqParam>, res: Response) => {
    const { id } = req.params
    const result = await postService.handleGetLikesPost(Number(id))
    res.json(result)
  },
  addPost: async (req: Request<ParamsDictionary, any, PostType>, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await postService.handleAddPost(userId, req.body)
    res.status(HTTP_STATUS.CREATED).json(result)
  },
  likePost: async (req: Request<ParamsDictionary, any, LikePostReqBody>, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await postService.handleLikePost(userId, req.body)
    res.status(HTTP_STATUS.CREATED).json(result)
  },
  deletePost: async (req: Request, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const { id } = req.params
    const result = await postService.handleDeletePost(Number(id), userId)
    return res.json(result)
  },
  unLikePost: async (req: Request, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const { id } = req.params
    const result = await postService.handleUnlikePost(Number(id), userId)
    res.json(result)
  },
  updatePost: async (req: Request<ParamsDictionary, any, UpdatePostReqBody>, res: Response) => {
    const { id } = req.params
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await postService.handleUpdatePost(Number(id), req.body, userId)
    return res.json(result)
  },
  getLikes: async (req: Request, res: Response) => {
    const result = await postService.handleGetLikes()
    return res.json(result)
  },
  sharePost: async (req: Request<ParamsDictionary, any, SharePostReqBody>, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const { postId, type } = req.body
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
    const data = (await axios.get(link as string)).data
    return res.json(data)
  }
}

export default postController
