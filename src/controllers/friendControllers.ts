import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import friendService from '~/services/friendServices'
import { FriendType } from '~/types/friendTypes'
import { TokenPayload } from '~/types/userTypes'

const friendController = {
  getFriendList: async (req: Request, res: Response) => {
    const result = await friendService.handleGetAllFriend()
    return res.json(result)
  },
  addFriend: async (req: Request<ParamsDictionary, any, FriendType>, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await friendService.handleAddFriend(userId, req.body)
    return res.status(HTTP_STATUS.CREATED).json(result)
  },
  deleteFriend: async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await friendService.handleDeleteFriend(Number(id))
    return res.json(result)
  },
  acceptFriend: async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await friendService.handleAcceptFriend(Number(id))
    return res.json(result)
  }
}

export default friendController
