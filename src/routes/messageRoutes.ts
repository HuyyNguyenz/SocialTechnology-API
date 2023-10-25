import { Router } from 'express'
import messageController from '~/controllers/messageControllers'
import {
  checkFriendStatus,
  createMessageValidator,
  deleteMessageValidator,
  updateMessageValidator
} from '~/middlewares/messageMiddlewares'
import { verifyTokenValidator } from '~/middlewares/userMiddlewares'
import wrapRequestHandler from '~/utils/handlers'

const messageRouter = Router()

/*
  Path: /messages
  Method: GET
  Header: Authorization Bear <accessToken>
*/
messageRouter.get('/messages', verifyTokenValidator, wrapRequestHandler(messageController.getMessageList))
/*
  Path: /message
  Method: POST
  Header: Authorization Bear <accessToken>
  Body: MessageType
*/
messageRouter.post(
  '/message',
  verifyTokenValidator,
  createMessageValidator,
  checkFriendStatus,
  wrapRequestHandler(messageController.addMessage)
)
/*
  Path: /message/:id
  Method: DELETE
  Header: Authorization Bear <accessToken>
*/
messageRouter.delete(
  '/message/:id',
  verifyTokenValidator,
  deleteMessageValidator,
  wrapRequestHandler(messageController.deleteMessage)
)
/*
  Path: /message/:id
  Method: PUT
  Header: Authorization Bear <accessToken>
  Body: UpdateMessageReqBody
*/
messageRouter.put(
  '/message/:id',
  verifyTokenValidator,
  updateMessageValidator,
  wrapRequestHandler(messageController.updateMessage)
)

export default messageRouter
