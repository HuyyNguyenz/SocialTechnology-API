import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import messageService from '~/services/messageServices'
import { TokenPayload, UserType } from '~/types/userTypes'
import { ParamsDictionary } from 'express-serve-static-core'
import { UpdateMessageReqBody } from '~/requestTypes'

const messageController = {
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
    return res.json(result)
  },
  addMessage: async (req: Request, res: Response) => {
    const { userId } = req.decodedAccessToken as TokenPayload
    const friend = req.friend as UserType
    const result = await messageService.handleAddMessage(userId, req.body, friend)
    return res.status(HTTP_STATUS.CREATED).json(result)
  },
  deleteMessage: async (req: Request, res: Response) => {
    const { id } = req.params
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await messageService.handleDeleteMessage(Number(id), userId)
    return res.json(result)
  },
  updateMessage: async (req: Request<ParamsDictionary, any, UpdateMessageReqBody>, res: Response) => {
    const { id } = req.params
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await messageService.handleUpdateMessage(Number(id), req.body, userId)
    return res.json(result)
  }
}

export default messageController
