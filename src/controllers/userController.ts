import { Request, Response } from 'express'
import { TokenPayload, UserType } from '../types/userType'
import userService from '../services/userService'
import postService from '../services/postService'
import commentService from '../services/commentService'
import friendService from '../services/friendService'
import { FriendType } from '../types/friendType'
import notifyService from '../services/notifyService'
import messageService from '../services/messageService'
import axios from 'axios'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  RecoveryPasswordReqBody,
  RecoveryPasswordReqParam,
  SearchReqQuery,
  VerifyEmailReqBody,
  VerifyReqBody
} from '~/requestTypes'

const userController = {
  verifyUser: async (req: Request<ParamsDictionary, any, VerifyReqBody>, res: Response) => {
    const { username } = req.body
    if (username) {
      const result = await userService.handleVerifyUser(username)
      res.json(result)
    }
  },
  registerUser: async (req: Request<ParamsDictionary, any, UserType>, res: Response) => {
    const userData = req.body
    if (userData) {
      const result = await userService.handleRegister(userData)
      return res.status(result.status).json(result)
    }
  },
  loginUser: async (req: Request, res: Response) => {
    const user = req.user as UserType
    if (user) {
      const result = await userService.handleLogin(user)
      res.json(result)
    }
  },
  getMe: async (req: Request, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await userService.handleGetMe(userId)
    return res.json(result)
  },
  getUser: (req: Request, res: Response) => {
    const { token, birthDay, createdAt, password, isOnline, otpCode, socketId, verify, ...userData } =
      req.user as UserType
    return res.json(userData)
  },
  getAllUser: async (req: Request, res: Response) => {
    const result = await userService.handleGetAllUser()
    result.length > 0 &&
      Array.from(result).forEach((user: any) => {
        if (user.avatar !== '') {
          const avatar = JSON.parse(user.avatar)
          user.avatar = avatar
        }
        if (user.backgroundImage !== '') {
          const backgroundImage = JSON.parse(user.backgroundImage)
          user.backgroundImage = backgroundImage
        }
      })
    res.status(200).json(result)
  },
  refreshToken: async (req: Request, res: Response) => {
    const { userId, exp } = req.decodedRefreshToken as TokenPayload
    const result = await userService.handleRefreshToken({ userId, exp })
    return res.json(result)
  },
  searchUser: async (req: Request<ParamsDictionary, any, any, SearchReqQuery>, res: Response) => {
    const { value, limit, page } = req.query
    const result = await userService.handleSearch({ value, limit: Number(limit), page: Number(page) })
    result.length > 0 &&
      Array.from(result).forEach((user: any) => {
        if (user.avatar !== '') {
          const avatar = JSON.parse(user.avatar)
          user.avatar = avatar
        }
        if (user.backgroundImage !== '') {
          const backgroundImage = JSON.parse(user.backgroundImage)
          user.backgroundImage = backgroundImage
        }
      })
    return res.json(result)
  },
  sendOtpFromMail: async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) => {
    const { email } = req.body
    const userData = req.user as UserType
    if (email && userData) {
      const result = await userService.handleSendOtp(email, userData)
      res.json(result)
    }
  },
  permitRecoveryPassword: async (req: Request, res: Response) => {
    const userOtp = (req.user as UserType).otpCode as string
    return res.json({ message: 'Verify successfully', userOtp })
  },
  recoveryPassword: async (req: Request<RecoveryPasswordReqParam, any, RecoveryPasswordReqBody>, res: Response) => {
    const { email } = req.params
    const { password } = req.body
    if (email && password) {
      const result = await userService.handleUpdatePassword(password, email)
      res.json(result)
    }
  },
  updateUserProfile: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id && req.body.id) {
      const result = await userService.handleUpdateProfile(Number(id), req.body)
      res.status(200).json(result)
    } else {
      const { socketId } = req.body
      const result = await userService.handleUpdateSocketId(Number(id), socketId)
      res.status(200).json(result)
    }
  },
  updateUserState: async (req: Request, res: Response) => {
    const { id, state } = req.params
    if (id && state) {
      const result = await userService.handleUpdateUserState(Number(id), state)
      res.status(200).json(result)
    }
  },
  getPostList: async (req: Request, res: Response) => {
    const { limit, offset } = req.params
    const result = await postService.handleGetPostList(Number(limit), Number(offset))
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
    res.status(200).json(result)
  },
  getPostListByUser: async (req: Request, res: Response) => {
    const { userId, limit, offset } = req.params
    const result = await postService.handleGetPostListByUser(Number(userId), Number(limit), Number(offset))
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
    res.status(200).json(result)
  },
  getPostDetail: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
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
      res.status(200).json(result)
    }
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
  },
  getFriendList: async (req: Request, res: Response) => {
    const result = await friendService.handleGetAllFriend()
    res.status(200).json(result)
  },
  requestMakeFriend: async (req: Request, res: Response) => {
    const data: FriendType = req.body
    if (data) {
      const result = await friendService.handleRequestMakeFriend(data)
      res.status(result.status).json(result)
    }
  },
  deleteFriend: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
      const result = await friendService.handleDeleteFriend(Number(id))
      res.status(result.status).json(result)
    }
  },
  acceptFriend: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
      const result = await friendService.handleAcceptFriend(Number(id))
      res.status(result.status).json(result)
    }
  },
  getNotifyList: async (req: Request, res: Response) => {
    const result = await notifyService.handleGetNotifyList()
    res.status(200).json(result)
  },
  updateNotify: async (req: Request, res: Response) => {
    const { id } = req.params
    const { receiverId } = req.body
    if (id) {
      const result = await notifyService.handleUpdateNotify(Number(id), Number(receiverId))
      res.status(result.status).json(result)
    }
  },
  getMessageList: async (req: Request, res: Response) => {
    const result = await messageService.handleGetMessageList()
    result.length > 0 &&
      Array.from(result).forEach((message: any) => {
        if (message.images) {
          const images = JSON.parse(message.images)
          message.images = images
        }
        if (message.video) {
          const video = JSON.parse(message.video)
          message.video = video
        }
      })
    res.status(200).json(result)
  },
  addMessage: async (req: Request, res: Response) => {
    const { createdAt } = req.body
    if (createdAt) {
      const result = await messageService.handleAddMessage(req.body)
      res.status(result.status).json(result)
    }
  },
  deleteMessage: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
      const result = await messageService.handleDeleteMessage(Number(id))
      res.status(result.status).json(result)
    }
  },
  updateMessage: async (req: Request, res: Response) => {
    const { id } = req.params
    if (id) {
      const result = await messageService.handleUpdateMessage(Number(id), req.body)
      res.status(result.status).json(result)
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
  }
}

export default userController
