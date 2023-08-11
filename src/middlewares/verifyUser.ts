import { Request, Response, NextFunction } from 'express'
import User from '~/models/User'

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body
  if ((email as string).includes('@')) {
    const user = new User()
    const sql = 'SELECT * FROM `users` WHERE email=?'
    const values = [email]
    const [result]: any = await user.find(sql, values)
    result && result.verify === 'true'
      ? next()
      : res.status(401).json({
          message: result ? 'Tài khoản của bạn chưa xác thực. Vui lòng kiểm tra email' : 'Sai thông tin đăng nhập',
          status: 401
        })
  } else {
    res.status(401).json({ message: 'Sai thông tin đăng nhập', status: 401 })
  }
}

export default verifyUser
