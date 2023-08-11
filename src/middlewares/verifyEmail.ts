import { Request, Response, NextFunction } from 'express'
import User from '~/models/User'

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body
  if (email) {
    const user = new User()
    const sql = 'SELECT * FROM `users` WHERE email=?'
    const values = [email]
    const result = await user.find(sql, values)
    if (result.length > 0) {
      req.headers.userEmail = email
      next()
    } else {
      res.status(404).json({ message: 'Email chưa được đăng ký!' })
    }
  }
}

export default verifyEmail
