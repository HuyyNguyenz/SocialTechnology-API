import express, { Router, Express } from 'express'
import userController from '../controllers/userController'
import verifyToken from '../middlewares/verifyToken'
import verifyEmail from '../middlewares/verifyEmail'
import verifyOtp from '../middlewares/verifyOtp'
import verifyUser from '../middlewares/verifyUser'

const router: Router = express.Router()

const initialRoutes = (app: Express) => {
  router.put('/verifyUser/:username', userController.verifyUser)
  router.post('/register', userController.registerUser)
  router.post('/login', verifyUser, userController.loginUser)
  router.post('/refresh', userController.requestRefreshToken)
  router.post('/verifyEmail', verifyEmail, userController.sendOtpFromMail)
  router.post('/verifyOtp', verifyOtp, userController.permitRecoveryPassword)
  router.put('/recovery/:email', userController.recoveryPassword)
  router.post('/search', verifyToken, userController.searchUser)
  router.get('/user', verifyToken, userController.getUser)
  router.get('/user/:id', verifyToken, userController.getUser)
  router.get('/users', verifyToken, userController.getAllUser)
  router.put('/user/:id', verifyToken, userController.updateUserProfile)
  router.put('/user/:id/:state', verifyToken, userController.updateUserState)

  router.get('/posts/:limit/:offset', verifyToken, userController.getPostList)
  router.get('/postsUser/:userId/:limit/:offset', verifyToken, userController.getPostListByUser)
  router.get('/post/:id', verifyToken, userController.getPostDetail)
  router.get('/likes/post/:postId', verifyToken, userController.getLikesPost)
  router.get('/shares/post/:postId', verifyToken, userController.getSharesPost)
  router.get('/likes', verifyToken, userController.getLikes)
  router.post('/post', verifyToken, userController.addPost)
  router.post('/share/post', verifyToken, userController.sharePost)
  router.post('/like/post', verifyToken, userController.likePost)
  router.delete('/post/:id', verifyToken, userController.deletePost)
  router.delete('/unlike/post/:id', verifyToken, userController.deleteLikePost)
  router.put('/post/:id', verifyToken, userController.updatePost)

  router.get('/comments', verifyToken, userController.getCommentList)
  router.get('/commentsPost/:postId/:limit/:offset', verifyToken, userController.getCommentListByPost)
  router.post('/comment', verifyToken, userController.addComment)
  router.delete('/comment/:id', verifyToken, userController.deleteComment)
  router.put('/comment/:id', verifyToken, userController.updateComment)

  router.get('/friends', verifyToken, userController.getFriendList)
  router.post('/friend', verifyToken, userController.requestMakeFriend)
  router.delete('/friend/:id', verifyToken, userController.deleteFriend)
  router.put('/friend/:id', verifyToken, userController.acceptFriend)

  router.get('/notifies', verifyToken, userController.getNotifyList)
  router.put('/notify/:id', verifyToken, userController.updateNotify)

  router.get('/messages', verifyToken, userController.getMessageList)
  router.post('/message', verifyToken, userController.addMessage)
  router.delete('/message/:id', verifyToken, userController.deleteMessage)
  router.put('/message/:id', verifyToken, userController.updateMessage)

  router.get('/article', verifyToken, userController.getArticle)

  return app.use('/api/', router)
}

export default initialRoutes
