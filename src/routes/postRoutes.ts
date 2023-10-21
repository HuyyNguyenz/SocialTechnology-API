import { Router } from 'express'
import postController from '~/controllers/postControllers'
import {
  createPostValidator,
  deletePostValidator,
  likePostValidator,
  sharePostValidator,
  unLikeValidator,
  updatePostValidator
} from '~/middlewares/postMiddlewares'
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
  Body: { userId:number, postId:number, type:string }
*/
postRouter.post('/share/post', verifyTokenValidator, sharePostValidator, wrapRequestHandler(postController.sharePost))
/*
  Path: /like/post
  Method: POST
  Header: Authorization Bear <accessToken>
  Body: { userId:number, postId:number, type:string }
*/
postRouter.post('/like/post', verifyTokenValidator, likePostValidator, wrapRequestHandler(postController.likePost))
/*
  Path: /post/:id
  Method: DELETE
  Header: Authorization Bear <accessToken>
  Body: { userId:number, postId:number, type:string }
*/
postRouter.delete('/post/:id', verifyTokenValidator, deletePostValidator, wrapRequestHandler(postController.deletePost))
/*
  Path: /unlike/post/:id
  Method: DELETE
  Header: Authorization Bear <accessToken>
*/
postRouter.delete(
  '/unlike/post/:id',
  verifyTokenValidator,
  unLikeValidator,
  wrapRequestHandler(postController.unLikePost)
)
/*
  Path: /post/:id
  Method: PUT
  Header: Authorization Bear <accessToken>
  Body: UpdatePostReqBody
*/
postRouter.put('/post/:id', verifyTokenValidator, updatePostValidator, wrapRequestHandler(postController.updatePost))
postRouter.get('/article', verifyTokenValidator, wrapRequestHandler(postController.getArticle))

export default postRouter
