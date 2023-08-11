import { Request, Response, NextFunction } from 'express'
import User from '~/models/User'

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { otpCode, userEmail } = req.body
  if (otpCode && userEmail) {
    const user = new User()
    const sql = 'SELECT * FROM `users` WHERE otpCode=? AND email=?'
    const values = [otpCode, userEmail]
    try {
      const [result]: any = await user.find(sql, values)
      if (result) {
        req.headers.userOtp = JSON.stringify({ otpCode, userEmail })
        next()
      } else {
        throw 'Mã xác nhận không chính xác'
      }
    } catch (error) {
      res.status(404).json({ message: error })
    }
  }
}

export default verifyOtp
