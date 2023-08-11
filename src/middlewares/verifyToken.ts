import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization as string
  if (token) {
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY as string, (error, user) => {
      if (error) {
        res.status(403).json({ message: 'Token is not valid' })
      } else {
        req.headers.user = JSON.stringify(user)
        next()
      }
    })
  } else {
    res.status(401).json({ message: "You're not authenticated" })
  }
}

export default verifyToken
