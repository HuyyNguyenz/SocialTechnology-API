import { Request, Response } from 'express'
import { TokenPayload, UserType } from '../types/userType'
import userService from '../services/userService'
import commentService from '../services/commentService'
import friendService from '../services/friendService'
import { FriendType } from '../types/friendType'
import notifyService from '../services/notifyService'
import messageService from '../services/messageService'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  RecoveryPasswordReqBody,
  RecoveryPasswordReqParam,
  SearchReqQuery,
  UpdateProfileReqBody,
  VerifyEmailReqBody,
  VerifyReqBody
} from '~/requestTypes'
import HTTP_STATUS from '~/constants/httpStatus'

const userController = {
  verifyUser: async (req: Request<ParamsDictionary, any, VerifyReqBody>, res: Response) => {
    const { username } = req.body
    if (username) {
      const result = await userService.handleVerifyUser(username)
      res.json(result)
    }
  },
  registerUser: async (req: Request<ParamsDictionary, any, UserType>, res: Response) => {
    const result = await userService.handleRegister(req.body)
    return res.status(HTTP_STATUS.CREATED).json(result)
  },
  loginUser: async (req: Request, res: Response) => {
    const user = req.user as UserType
    if (user) {
      const result = await userService.handleLogin(user)
      res.json(result)
    }
  },
  logoutUser: async (req: Request, res: Response) => {
    const { userId } = req.decodedRefreshToken as TokenPayload
    const result = await userService.handleLogout(userId)
    return res.json(result)
  },
  getMe: async (req: Request, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await userService.handleGetMe(userId)
    return res.json(result)
  },
  getUser: (req: Request, res: Response) => {
    const { token, password, isOnline, otpCode, socketId, verify, ...user } = req.user as UserType
    return res.json(user)
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
  updateUserProfile: async (req: Request<ParamsDictionary, any, UpdateProfileReqBody>, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await userService.handleUpdateProfile(userId, req.body)
    return res.json(result)
  },
  updateUserState: async (req: Request, res: Response) => {
    const { state } = req.params
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await userService.handleUpdateUserState(userId, state)
    res.json(result)
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
  }
}

export default userController
