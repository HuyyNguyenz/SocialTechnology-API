import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import initialRoutes from './routes'
import cors from 'cors'
import './utils/socket'

dotenv.config()
const app: Express = express()
const port = process.env.PORT || 8080

// Config express get value from request body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Config CORS
app.use(cors())
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-type')
  next()
})

initialRoutes(app)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
