import { Router } from 'express'
import commentController from '~/controllers/commentControllers'
import {
  createCommentValidator,
  deleteCommentValidator,
  updateCommentValidator
} from '~/middlewares/commentMiddlewares'
import { paginationValidator, verifyTokenValidator } from '~/middlewares/userMiddlewares'
import wrapRequestHandler from '~/utils/handlers'

const commentRouter = Router()
/*
  Path: /comments
  Method: GET
  Header: Authorization Bear <accessToken>
*/
commentRouter.get('/comments', verifyTokenValidator, wrapRequestHandler(commentController.getCommentList))
/*
  Path: /comments-post/:id
  Method: GET
  Header: Authorization Bear <accessToken>
  Query: { limit:number, page:number }
*/
commentRouter.get(
  '/comments-post/:id',
  verifyTokenValidator,
  paginationValidator,
  wrapRequestHandler(commentController.getCommentListByPost)
)
/*
  Path: /comment
  Method: POST
  Header: Authorization Bear <accessToken>
  Body: CommentType
*/
commentRouter.post(
  '/comment',
  verifyTokenValidator,
  createCommentValidator,
  wrapRequestHandler(commentController.addComment)
)
/*
  Path: /comment/:id
  Method: DELETE
  Header: Authorization Bear <accessToken>
*/
commentRouter.delete(
  '/comment/:id',
  verifyTokenValidator,
  deleteCommentValidator,
  wrapRequestHandler(commentController.deleteComment)
)
/*
  Path: /comment/:id
  Method: PUT
  Header: Authorization Bear <accessToken>
  Body: UpdateCommentReqBody
*/
commentRouter.put(
  '/comment/:id',
  verifyTokenValidator,
  updateCommentValidator,
  wrapRequestHandler(commentController.updateComment)
)

export default commentRouter
