import { Router } from 'express'
import userController from '~/controllers/userController'
import {
  loginValidator,
  paginationValidator,
  recoveryPasswordValidator,
  refreshTokenValidator,
  registerValidator,
  updateProfileValidator,
  usernameValidator,
  verifiedUser,
  verifyEmailValidator,
  verifyOtpValidator,
  verifyTokenValidator
} from '~/middlewares/userMiddlewares'
import wrapRequestHandler from '~/utils/handlers'

const userRouter = Router()

userRouter.post('/register', registerValidator, wrapRequestHandler(userController.registerUser))
userRouter.post('/verify-user', usernameValidator, wrapRequestHandler(userController.verifyUser))
userRouter.post('/login', loginValidator, verifiedUser, wrapRequestHandler(userController.loginUser))
userRouter.post('/logout', verifyTokenValidator, refreshTokenValidator, wrapRequestHandler(userController.logoutUser))
userRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(userController.refreshToken))
userRouter.post('/verify-email', verifyEmailValidator, wrapRequestHandler(userController.sendOtpFromMail))
userRouter.post('/verify-otp', verifyOtpValidator, wrapRequestHandler(userController.permitRecoveryPassword))
userRouter.put(
  '/recovery-password/:email',
  recoveryPasswordValidator,
  wrapRequestHandler(userController.recoveryPassword)
)
userRouter.get('/search', verifyTokenValidator, paginationValidator, wrapRequestHandler(userController.searchUser))
userRouter.get('/me', verifyTokenValidator, wrapRequestHandler(userController.getMe))
userRouter.get('/user/:username', usernameValidator, wrapRequestHandler(userController.getUser))
userRouter.put(
  '/user',
  verifyTokenValidator,
  updateProfileValidator,
  wrapRequestHandler(userController.updateUserProfile)
)
userRouter.put('/user/:id/:state', verifyTokenValidator, wrapRequestHandler(userController.updateUserState))

export default userRouter
