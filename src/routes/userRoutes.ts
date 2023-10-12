import { Router } from 'express'
import userController from '~/controllers/userController'
import {
  loginValidator,
  paginationValidator,
  recoveryPasswordValidator,
  refreshTokenValidator,
  registerValidator,
  usernameValidator,
  verifiedUser,
  verifyEmailValidator,
  verifyOtpValidator,
  verifyTokenValidator
} from '~/middlewares/userMiddlewares'

const userRouter = Router()

userRouter.post('/register', registerValidator, userController.registerUser)
userRouter.post('/verify-user', usernameValidator, userController.verifyUser)
userRouter.post('/login', loginValidator, verifiedUser, userController.loginUser)
userRouter.post('/refresh-token', refreshTokenValidator, userController.refreshToken)
userRouter.post('/verify-email', verifyEmailValidator, userController.sendOtpFromMail)
userRouter.post('/verify-otp', verifyOtpValidator, userController.permitRecoveryPassword)
userRouter.put('/recovery-password/:email', recoveryPasswordValidator, userController.recoveryPassword)
userRouter.get('/search', verifyTokenValidator, paginationValidator, userController.searchUser)
userRouter.get('/user', verifyTokenValidator, userController.getUser)
userRouter.get('/user/:id', verifyTokenValidator, userController.getUser)
userRouter.get('/users', verifyTokenValidator, userController.getAllUser)
userRouter.put('/user/:id', verifyTokenValidator, userController.updateUserProfile)
userRouter.put('/user/:id/:state', verifyTokenValidator, userController.updateUserState)

export default userRouter
