import { Router } from 'express'
import postController from '~/controllers/postControllers'
import { paginationValidator, verifyTokenValidator } from '~/middlewares/userMiddlewares'
import wrapRequestHandler from '~/utils/handlers'

const postRouter = Router()

/*
  Path: /posts
  Method: GET
  Header: Authorization Bear <accessToken>
  Query: { limit:number, page:number }
*/
postRouter.get('/posts', verifyTokenValidator, paginationValidator, wrapRequestHandler(postController.getPostList))
/*
  Path: /posts-user/:userId
  Method: GET
  Header: Authorization Bear <accessToken>
  Query: { limit:number, page:number }
*/
postRouter.get(
  '/posts-user/:userId',
  verifyTokenValidator,
  paginationValidator,
  wrapRequestHandler(postController.getPostListByUser)
)
/*
  Path: /post/:id
  Method: GET
  Header: Authorization Bear <accessToken>
*/
postRouter.get('/post/:id', verifyTokenValidator, wrapRequestHandler(postController.getPostDetail))
postRouter.get('/likes/post/:postId', verifyTokenValidator, wrapRequestHandler(postController.getLikesPost))
postRouter.get('/shares/post/:postId', verifyTokenValidator, wrapRequestHandler(postController.getSharesPost))
postRouter.get('/likes', verifyTokenValidator, wrapRequestHandler(postController.getLikes))
postRouter.post('/post', verifyTokenValidator, wrapRequestHandler(postController.addPost))
postRouter.post('/share/post', verifyTokenValidator, wrapRequestHandler(postController.sharePost))
postRouter.post('/like/post', verifyTokenValidator, wrapRequestHandler(postController.likePost))
postRouter.delete('/post/:id', verifyTokenValidator, wrapRequestHandler(postController.deletePost))
postRouter.delete('/unlike/post/:id', verifyTokenValidator, wrapRequestHandler(postController.deleteLikePost))
postRouter.put('/post/:id', verifyTokenValidator, wrapRequestHandler(postController.updatePost))
postRouter.get('/article', verifyTokenValidator, wrapRequestHandler(postController.getArticle))

export default postRouter
