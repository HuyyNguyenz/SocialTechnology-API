import { Router } from 'express'
import userController from '~/controllers/userController'
import { registerValidator } from '~/middlewares/userMiddlewares'
import verifyEmail from '~/middlewares/verifyEmail'
import verifyOtp from '~/middlewares/verifyOtp'
import verifyToken from '~/middlewares/verifyToken'
import verifyUser from '~/middlewares/verifyUser'

const userRouter = Router()

userRouter.post('/register', registerValidator, userController.registerUser)
userRouter.put('/verifyUser/:username', userController.verifyUser)
userRouter.post('/login', verifyUser, userController.loginUser)
userRouter.post('/refresh', userController.requestRefreshToken)
userRouter.post('/verifyEmail', verifyEmail, userController.sendOtpFromMail)
userRouter.post('/verifyOtp', verifyOtp, userController.permitRecoveryPassword)
userRouter.put('/recovery/:email', userController.recoveryPassword)
userRouter.post('/search', verifyToken, userController.searchUser)
userRouter.get('/user', verifyToken, userController.getUser)
userRouter.get('/user/:id', verifyToken, userController.getUser)
userRouter.get('/users', verifyToken, userController.getAllUser)
userRouter.put('/user/:id', verifyToken, userController.updateUserProfile)
userRouter.put('/user/:id/:state', verifyToken, userController.updateUserState)

export default userRouter
