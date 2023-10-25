import { Request, Response } from 'express'
import notifyService from '~/services/notifyServices'
import { TokenPayload } from '~/types/userTypes'

const notifyController = {
  getNotifyList: async (req: Request, res: Response) => {
    const result = await notifyService.handleGetNotifyList()
    return res.json(result)
  },
  updateNotify: async (req: Request, res: Response) => {
    const { id } = req.params
    const { userId } = req.decodedAccessToken as TokenPayload
    const result = await notifyService.handleUpdateNotify(Number(id), userId)
    return res.json(result)
  }
}

export default notifyController
