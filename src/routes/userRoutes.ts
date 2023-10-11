import { Router } from 'express'
import userController from '~/controllers/userController'
import {
  loginValidator,
  recoveryPasswordValidator,
  refreshTokenValidator,
  registerValidator,
  usernameValidator,
  verifiedUser,
  verifyEmailValidator,
  verifyOtpValidator
} from '~/middlewares/userMiddlewares'
import verifyToken from '~/middlewares/verifyToken'

const userRouter = Router()

userRouter.post('/register', registerValidator, userController.registerUser)
userRouter.post('/verify-user', usernameValidator, userController.verifyUser)
userRouter.post('/login', loginValidator, verifiedUser, userController.loginUser)
userRouter.post('/refresh-token', refreshTokenValidator, userController.refreshToken)
userRouter.post('/verify-email', verifyEmailValidator, userController.sendOtpFromMail)
userRouter.post('/verify-otp', verifyOtpValidator, userController.permitRecoveryPassword)
userRouter.put('/recovery-password/:email', recoveryPasswordValidator, userController.recoveryPassword)
userRouter.post('/search', verifyToken, userController.searchUser)
userRouter.get('/user', verifyToken, userController.getUser)
userRouter.get('/user/:id', verifyToken, userController.getUser)
userRouter.get('/users', verifyToken, userController.getAllUser)
userRouter.put('/user/:id', verifyToken, userController.updateUserProfile)
userRouter.put('/user/:id/:state', verifyToken, userController.updateUserState)

export default userRouter
