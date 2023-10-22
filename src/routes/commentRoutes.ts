import { Router } from 'express'
import commentController from '~/controllers/commentControllers'
import { verifyTokenValidator } from '~/middlewares/userMiddlewares'
import wrapRequestHandler from '~/utils/handlers'

const commentRouter = Router()

commentRouter.get('/comments', verifyTokenValidator, wrapRequestHandler(commentController.getCommentList))
commentRouter.get(
  '/commentsPost/:postId/:limit/:offset',
  verifyTokenValidator,
  wrapRequestHandler(commentController.getCommentListByPost)
)
commentRouter.post('/comment', verifyTokenValidator, wrapRequestHandler(commentController.addComment))
commentRouter.delete('/comment/:id', verifyTokenValidator, wrapRequestHandler(commentController.deleteComment))
commentRouter.put('/comment/:id', verifyTokenValidator, wrapRequestHandler(commentController.updateComment))

export default commentRouter
