import { Router } from 'express'
import friendController from '~/controllers/friendControllers'
import { acceptFriendValidator, addFriendValidator, deleteFriendValidator } from '~/middlewares/friendMiddlewares'
import { verifyTokenValidator } from '~/middlewares/userMiddlewares'
import wrapRequestHandler from '~/utils/handlers'

const friendRouter = Router()
/*
  Path: /friends
  Method: GET
  Header: Authorization Bear <accessToken>
*/
friendRouter.get('/friends', verifyTokenValidator, wrapRequestHandler(friendController.getFriendList))
/*
  Path: /friend
  Method: POST
  Header: Authorization Bear <accessToken>
  Body: { friendId:number,status:string }
*/
friendRouter.post('/friend', verifyTokenValidator, addFriendValidator, wrapRequestHandler(friendController.addFriend))
/*
  Path: /friend/:id
  Method: DELETE
  Header: Authorization Bear <accessToken>
*/
friendRouter.delete(
  '/friend/:id',
  verifyTokenValidator,
  deleteFriendValidator,
  wrapRequestHandler(friendController.deleteFriend)
)
/*
  Path: /friend/:id
  Method: PUT
  Header: Authorization Bear <accessToken>
  Body: { friendId:number,status:string }
*/
friendRouter.put(
  '/friend/:id',
  verifyTokenValidator,
  acceptFriendValidator,
  wrapRequestHandler(friendController.acceptFriend)
)

export default friendRouter
