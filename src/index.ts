import express from 'express'
import http from 'http'
import cors from 'cors'
import userRouter from './routes/userRoutes'
import { defaultErrorHandler } from './middlewares/errorMiddlewares'
import postRouter from './routes/postRoutes'
import commentRouter from './routes/commentRoutes'
import friendRouter from './routes/friendRoutes'
import notifyRouter from './routes/notifyRoutes'
import messageRouter from './routes/messageRoutes'
import { config } from 'dotenv'
import initialSocket from './utils/socket'

config()
const app = express()
const port = process.env.PORT || 8080

// Config express get value from request body
app.use(express.json())

// Config CORS
app.use(cors())

// Initial routes
app.use('/api', userRouter)
app.use('/api', postRouter)
app.use('/api', commentRouter)
app.use('/api', friendRouter)
app.use('/api', notifyRouter)
app.use('/api', messageRouter)
app.use(defaultErrorHandler)

const httpServer = http.createServer(app)

initialSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}/`)
})
