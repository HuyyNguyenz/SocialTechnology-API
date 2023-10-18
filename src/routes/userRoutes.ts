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

/*
  Path: /register
  Method: POST
  Body: UserType
*/
userRouter.post('/register', registerValidator, wrapRequestHandler(userController.registerUser))
/*
  Path: /verify-user
  Method: POST
  Body: { username:string }
*/
userRouter.post('/verify-user', usernameValidator, wrapRequestHandler(userController.verifyUser))
/*
  Path: /login
  Method: POST
  Body: { email:string, password:string }
*/
userRouter.post('/login', loginValidator, verifiedUser, wrapRequestHandler(userController.loginUser))
/*
  Path: /logout
  Method: POST
  Header: Authorization Bear <accessToken>
  Body: { refreshToken:string }
*/
userRouter.post('/logout', verifyTokenValidator, refreshTokenValidator, wrapRequestHandler(userController.logoutUser))
/*
  Path: /refresh-token
  Method: POST
  Body: { refreshToken:string }
*/
userRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(userController.refreshToken))
/*
  Path: /verify-email
  Method: POST
  Body: { email:string }
*/
userRouter.post('/verify-email', verifyEmailValidator, wrapRequestHandler(userController.sendOtpFromMail))
/*
  Path: /verify-otp
  Method: POST
  Body: { otpCode:string }
*/
userRouter.post('/verify-otp', verifyOtpValidator, wrapRequestHandler(userController.permitRecoveryPassword))
/*
  Path: /recovery-password/:email
  Method: PUT
  Body: { password:string }
*/
userRouter.put(
  '/recovery-password/:email',
  recoveryPasswordValidator,
  wrapRequestHandler(userController.recoveryPassword)
)
/*
  Path: /search
  Method: GET
  Header: Authorization Bear <accessToken>
  Query: { value:string, limit:number, page:number }
*/
userRouter.get('/search', verifyTokenValidator, paginationValidator, wrapRequestHandler(userController.searchUser))
/*
  Path: /me
  Method: GET
  Header: Authorization Bear <accessToken>
*/
userRouter.get('/me', verifyTokenValidator, wrapRequestHandler(userController.getMe))
/*
  Path: /user/:username
  Method: GET
*/
userRouter.get('/user/:username', verifyTokenValidator, usernameValidator, wrapRequestHandler(userController.getUser))
/*
  Path: /users
  Method: GET
  Header: Authorization Bear <accessToken>
*/
userRouter.get('/users', verifyTokenValidator, wrapRequestHandler(userController.getAllUser))
/*
  Path: /user
  Method: PUT
  Header: Authorization Bear <accessToken>
  Body: UpdateProfileReqBody
*/
userRouter.put(
  '/user',
  verifyTokenValidator,
  updateProfileValidator,
  wrapRequestHandler(userController.updateUserProfile)
)
/*
  Path: /user/:id/:state
  Method: PUT
  Header: Authorization Bear <accessToken>
*/
userRouter.put('/user/:id/:state', verifyTokenValidator, wrapRequestHandler(userController.updateUserState))

export default userRouter
