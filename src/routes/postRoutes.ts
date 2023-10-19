import { Router } from 'express'
import postController from '~/controllers/postControllers'
import { createPostValidator, sharePostValidator } from '~/middlewares/postMiddlewares'
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
/*
  Path: /likes/post/:id
  Method: GET
  Header: Authorization Bear <accessToken>
*/
postRouter.get('/likes/post/:id', verifyTokenValidator, wrapRequestHandler(postController.getLikesPost))
/*
  Path: /shares/post/:id
  Method: GET
  Header: Authorization Bear <accessToken>
*/
postRouter.get('/shares/post/:id', verifyTokenValidator, wrapRequestHandler(postController.getSharesPost))
/*
  Path: /likes
  Method: GET
  Header: Authorization Bear <accessToken>
*/
postRouter.get('/likes', verifyTokenValidator, wrapRequestHandler(postController.getLikes))
/*
  Path: /post
  Method: POST
  Header: Authorization Bear <accessToken>
  Body: PostType
*/
postRouter.post('/post', verifyTokenValidator, createPostValidator, wrapRequestHandler(postController.addPost))
/*
  Path: /share/post
  Method: POST
  Header: Authorization Bear <accessToken>
  Body: 
*/
postRouter.post('/share/post', verifyTokenValidator, sharePostValidator, wrapRequestHandler(postController.sharePost))
postRouter.post('/like/post', verifyTokenValidator, wrapRequestHandler(postController.likePost))
postRouter.delete('/post/:id', verifyTokenValidator, wrapRequestHandler(postController.deletePost))
postRouter.delete('/unlike/post/:id', verifyTokenValidator, wrapRequestHandler(postController.deleteLikePost))
postRouter.put('/post/:id', verifyTokenValidator, wrapRequestHandler(postController.updatePost))
postRouter.get('/article', verifyTokenValidator, wrapRequestHandler(postController.getArticle))

export default postRouter
