import md5 from 'md5'
import jwt from 'jsonwebtoken'
import jwt_decode from 'jwt-decode'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import User from '~/models/User'
import { LoginData, UserType } from '~/types/userType'
import { emailGen } from '~/utils/email'

const userService = {
  generateAccessToken: (userId: number, expiresIn: string) => {
    return jwt.sign(
      {
        id: userId
      },
      process.env.ACCESS_TOKEN_KEY as string,
      { expiresIn }
    )
  },
  generateRefreshToken: (userId: number, expiresIn: string) => {
    return jwt.sign(
      {
        id: userId
      },
      process.env.REFRESH_TOKEN_KEY as string,
      { expiresIn }
    )
  },
  handleRegister: async (userData: UserType) => {
    const { email, password, firstName, lastName, birthDay, gender, createdAt } = userData
    const username = email.split('@')[0] + birthDay.split('/')[0] + birthDay.split('/')[1]
    const md5Password = md5(password)
    const user = new User(username, email, md5Password, firstName, lastName, birthDay, gender, createdAt)
    const result = await user.insert()
    if (result.code === 'ER_DUP_ENTRY') {
      return { message: 'Email đã được đăng ký!', status: 409, code: result.code }
    } else {
      const config = {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        }
      }
      const transporter = nodemailer.createTransport(config)
      const html = emailGen(
        userData.lastName,
        'Social Technology',
        `${process.env.CLIENT}/verify/register/${username}`,
        'XÁC THỰC EMAIL',
        'Về việc đăng ký tài khoản Social Technology',
        'Để hoàn tất việc đăng ký tài khoản. Bạn cần nhấn vào nút bên dưới để xác thực email'
      )
      await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: 'XÁC THỰC EMAIL', // Subject line
        html // html body
      })
      return {
        message: 'Chúng tôi đã gửi email xác nhận về cho bạn. Vui lòng kiểm tra hộp thư để hoàn tất đăng ký',
        status: 201
      }
    }
  },
  handleVerifyUser: async (username: string) => {
    const user = new User()
    const sql = 'UPDATE `users` SET verify=? WHERE username=?'
    const values = ['true', username]
    await user.update(sql, values)
    return { message: 'Xác thực tài khoản thành công' }
  },
  handleLogin: async (userData: LoginData) => {
    const { email, password } = userData
    const md5Password = md5(password)
    const user = new User()
    const sql = 'SELECT * FROM `users` WHERE email=? AND password=?'
    const values = [email, md5Password]
    const result = await user.find(sql, values)
    if (result.length > 0) {
      const accessToken = userService.generateAccessToken(result[0].id, '300s')
      const refreshToken = userService.generateRefreshToken(result[0].id, '365d')
      const sql = 'UPDATE `users` SET token=? WHERE id=?'
      const values = [refreshToken, result[0].id]
      await user.update(sql, values)
      return { message: 'Đăng nhập thành công', status: 200, accessToken, refreshToken }
    } else {
      return { message: 'Sai thông tin đăng nhập!', status: 404 }
    }
  },
  handleGetUser: async (userId: string) => {
    const user = new User()
    const sql = 'SELECT * FROM `users` WHERE id=? OR username=?'
    const values = [userId, userId]
    const result = await user.find(sql, values)
    if (result.length > 0) {
      const { password, token, otpCode, socketId, ...data } = result[0]
      return { data, status: 200 }
    } else {
      return { message: 'Không tìm thấy', status: 404 }
    }
  },
  handleGetAllUser: async () => {
    const user = new User()
    const result: UserType[] = await user.getAll()
    const userArray: any[] = []
    Array.from(result).forEach((user) => {
      const { password, token, otpCode, socketId, ...data } = user
      userArray.push(data)
    })
    return userArray
  },
  handleRefreshToken: async (refreshToken: string) => {
    const decodeToken: any = jwt_decode(refreshToken)
    if (decodeToken.id) {
      const user = new User()
      const sql = 'SELECT * FROM `users` WHERE id=? AND token=?'
      const values = [decodeToken.id, refreshToken]
      const result = await user.find(sql, values)
      if (result.length > 0) {
        const accessToken = userService.generateAccessToken(decodeToken.id, '300s')
        const refreshToken = userService.generateRefreshToken(decodeToken.id, '365d')
        const sql = 'UPDATE `users` SET token=? WHERE id=?'
        const values = [refreshToken, decodeToken.id]
        await user.update(sql, values)
        return { message: 'Refresh Token Successfully', status: 200, accessToken, refreshToken }
      } else {
        return { message: 'Token is not valid', status: 403 }
      }
    } else {
      return { message: "You're not authenticated", status: 401 }
    }
  },
  handleSearch: async (searchValue: string) => {
    const user = new User()
    const sql = `SELECT * FROM users WHERE firstName COLLATE utf8_general_ci like '%${searchValue}%' OR lastName COLLATE utf8_general_ci like '%${searchValue}%'`
    const values = [searchValue, searchValue]
    const result = await user.find(sql, values)
    if (result.length > 0) {
      return result
    } else {
      const sql = 'SELECT * FROM users WHERE MATCH(firstName,lastName) AGAINST(?)'
      const values = [searchValue]
      const resultFullText = await user.find(sql, values)
      return resultFullText
    }
  },
  handleSendOtp: async (userEmail: string) => {
    const otpCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false })
    const user = new User()
    const sql = 'UPDATE `users` SET otpCode=? WHERE email=?'
    const foundUser: UserType[] = await user.find('SELECT * FROM users WHERE email=?', [userEmail])
    const values = [otpCode, userEmail]
    await user.update(sql, values)

    const config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    }
    const transporter = nodemailer.createTransport(config)
    const html = emailGen(foundUser[0].lastName, 'Social Technology', 'http://127.0.0.1:3000/', otpCode)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: userEmail, // list of receivers
        subject: 'KHÔI PHỤC MẬT KHẨU', // Subject line
        html // html body
      })
      return { message: 'Đã gửi mã xác nhận qua email. Vui lòng kiểm tra email của bạn', status: 201 }
    } catch (error) {
      return { error, status: 500 }
    }
  },
  handleResetPassword: async (password: string, email: string) => {
    const md5Password = md5(password)
    const user = new User()
    const sql = 'UPDATE `users` SET password=?,otpCode=null WHERE email=?'
    const values = [md5Password, email]
    try {
      await user.update(sql, values)
      return { message: 'Cập nhật mật khẩu thành công', status: 200 }
    } catch (error) {
      return { error, status: 500 }
    }
  },
  handleUpdateProfile: async (id: number, data: UserType) => {
    const user = new User()
    const { firstName, lastName, birthDay, gender, avatar, backgroundImage } = data
    const sql = 'UPDATE `users` SET firstName=?,lastName=?,birthDay=?,gender=?,avatar=?,backgroundImage=? WHERE id=?'
    const avatarString = avatar?.name !== '' ? JSON.stringify(avatar) : ''
    const backgroundImageString = backgroundImage?.name !== '' ? JSON.stringify(backgroundImage) : ''
    const values = [firstName, lastName, birthDay, gender, avatarString, backgroundImageString, id]
    await user.update(sql, values)
    return { message: 'Cập nhật thành công' }
  },
  handleUpdateSocketId: async (id: number, socketId: string) => {
    const user = new User()
    const sql = 'UPDATE users SET socketId=? WHERE id=?'
    const values = [socketId, id]
    await user.update(sql, values)
    return { message: 'Cập nhật socketId thành công' }
  },
  handleUpdateUserState: async (id: number, state: string) => {
    const user = new User()
    await user.update('UPDATE users SET isOnline=? WHERE id=?', [state, id])
    return { message: 'Cập nhật trạng thái thành công' }
  }
}

export default userService
