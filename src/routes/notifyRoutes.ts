import { Router } from 'express'
import notifyController from '~/controllers/notifyControllers'
import { updateNotifyValidator } from '~/middlewares/notifyMiddlewares'
import { verifyTokenValidator } from '~/middlewares/userMiddlewares'
import wrapRequestHandler from '~/utils/handlers'

const notifyRouter = Router()

/*
  Path: /notifies
  Method: GET
  Header: Authorization Bear <accessToken>
*/
notifyRouter.get('/notifies', verifyTokenValidator, wrapRequestHandler(notifyController.getNotifyList))
/*
  Path: /notify/:id
  Method: PUT
  Header: Authorization Bear <accessToken>
*/
notifyRouter.put(
  '/notify/:id',
  verifyTokenValidator,
  updateNotifyValidator,
  wrapRequestHandler(notifyController.updateNotify)
)

export default notifyRouter
