import md5 from 'md5'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import User from '../models/User'
import { UserType } from '../types/userType'
import { emailGen } from '../utils/email'
import { USER_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { config } from 'dotenv'
import { signToken } from '~/utils/jwt'
import { UpdateProfileReqBody } from '~/requestTypes'

config()
class UserService {
  private generateAccessToken = (userId: number, expiresIn: string) => {
    return signToken({
      payload: {
        userId
      },
      privateKey: process.env.ACCESS_TOKEN_KEY as string,
      options: {
        expiresIn
      }
    })
  }
  private generateRefreshToken = (userId: number, expiresIn: string) => {
    return signToken({
      payload: {
        userId
      },
      privateKey: process.env.REFRESH_TOKEN_KEY as string,
      options: {
        expiresIn
      }
    })
  }
  handleRegister = async (userData: UserType): Promise<{ message: string; status: number }> => {
    const { email, password, firstName, lastName, birthDay, gender, createdAt } = userData
    const username = email.split('@')[0] + birthDay.split('/')[0] + birthDay.split('/')[1]
    const md5Password = md5(password)
    const user = new User(username, email, md5Password, firstName, lastName, birthDay, gender, createdAt)
    const result = await user.insert()
    if (result.code === 'ER_DUP_ENTRY') {
      return { message: USER_MESSAGES.EMAIL_IS_ALREADY_EXISTS, status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
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
        'EMAIL VERIFY',
        'About registering a Social Technology account',
        'To complete account registration. You need to click the button below to authenticate your email'
      )
      await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: 'EMAIL VERIFY', // Subject line
        html // html body
      })
      return {
        message: 'We have sent you a confirmation email. Please check your email to complete your registration',
        status: HTTP_STATUS.CREATED
      }
    }
  }
  handleVerifyUser = async (username: string) => {
    const user = new User()
    const sql = 'UPDATE users SET verify=? WHERE username=?'
    const values = ['true', username]
    await user.update(sql, values)
    return { message: USER_MESSAGES.VERIFY_USER_SUCCESSFULLY }
  }
  handleLogin = async (userData: UserType) => {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(Number(userData.id), '300s'),
      this.generateRefreshToken(Number(userData.id), '365d')
    ])
    const user = new User()
    const sql = 'UPDATE users SET token=? WHERE id=?'
    const values = [refreshToken, Number(userData.id)]
    await user.update(sql, values)
    return { message: USER_MESSAGES.LOGIN_SUCCESSFULLY, accessToken, refreshToken }
  }
  handleLogout = async (userId: number) => {
    const user = new User()
    const sql = 'UPDATE users SET token=null WHERE id=?'
    await user.update(sql, [userId])
    return {
      message: USER_MESSAGES.LOGOUT_SUCCESSFULLY
    }
  }
  handleGetMe = async (userId: number) => {
    const user = new User()
    const sql = 'SELECT id,username,email,firstName,lastName,gender,avatar,backgroundImage FROM users WHERE id=?'
    const value = [userId]
    const [result] = await user.find(sql, value)
    const avatar = result.avatar !== '' && JSON.parse(result.avatar)
    const backgroundImage = result.backgroundImage !== '' && JSON.parse(result.backgroundImage)
    return { ...result, avatar, backgroundImage }
  }
  handleGetAllUser = async () => {
    const user = new User()
    const result: UserType[] = await user.getAll()
    const userArray: any[] = []
    Array.from(result).forEach((user) => {
      const { password, token, otpCode, socketId, ...data } = user
      userArray.push(data)
    })
    return userArray
  }
  handleRefreshToken = async ({ userId, exp }: { userId: number; exp: number }) => {
    const user = new User()
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, '300s'),
      this.generateRefreshToken(userId, exp + '')
    ])
    const sql = 'UPDATE users SET token=? WHERE id=?'
    const values = [refreshToken, userId]
    await user.update(sql, values)
    return { message: USER_MESSAGES.REFRESH_TOKEN_SUCCESSFULLY, accessToken, refreshToken }
  }
  handleSearch = async ({ value, limit, page }: { value: string; limit: number; page: number }) => {
    const user = new User()
    const sql = `SELECT id,username,email,firstName,lastName,gender,avatar,backgroundImage FROM users WHERE firstName COLLATE utf8_general_ci like '%${value}%' OR lastName COLLATE utf8_general_ci like '%${value}%' LIMIT ${limit} OFFSET ${
      limit * (page - 1)
    }`
    const result = await user.find(sql, [])
    if (result.length > 0) {
      return result
    } else {
      const sql = `SELECT id,username,email,firstName,lastName,gender,avatar,backgroundImage FROM users WHERE MATCH(firstName,lastName) AGAINST('${value}') LIMIT ${limit} OFFSET ${
        limit * (page - 1)
      }`
      const resultFullText = await user.find(sql, [])
      return resultFullText
    }
  }
  handleSendOtp = async (email: string, userData: UserType) => {
    const otpCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false })
    const user = new User()
    const sql = 'UPDATE users SET otpCode=? WHERE email=?'
    const values = [otpCode, email]
    await user.update(sql, values)
    const config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    }
    const transporter = nodemailer.createTransport(config)
    const html = emailGen(userData.lastName, 'Social Technology', 'http://127.0.0.1:3000/', otpCode)
    await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: 'RECOVERY PASSWORD', // Subject line
      html // html body
    })
    return { message: 'Otp code has been sent. Please check your email' }
  }
  handleUpdatePassword = async (password: string, email: string) => {
    const hashPassword = md5(password)
    const user = new User()
    const sql = 'UPDATE users SET password=?,otpCode=null WHERE email=?'
    const values = [hashPassword, email]
    await user.update(sql, values)
    return { message: USER_MESSAGES.UPDATE_PASSWORD_SUCCESSFULLY }
  }
  handleUpdateProfile = async (userId: number, data: UpdateProfileReqBody) => {
    const user = new User()
    const sql = `UPDATE users SET ${data.firstName ? `firstName='${data.firstName}'` : ''}${
      data.lastName ? `,lastName='${data.lastName}'` : ''
    }${data.birthDay ? `,birthDay='${data.birthDay}'` : ''}${data.gender ? `,gender='${data.gender}'` : ''}${
      data.avatar ? `,avatar='${JSON.stringify(data.avatar)}'` : ''
    }${data.backgroundImage ? `,backgroundImage='${JSON.stringify(data.backgroundImage)}'` : ''} WHERE id=${userId}`
    const result = await user.update(sql, [])
    return { message: USER_MESSAGES.UPDATE_PROFILE_SUCCESSFULLY, result }
  }
  handleUpdateSocketId = async (id: number, socketId: string) => {
    const user = new User()
    const sql = 'UPDATE users SET socketId=? WHERE id=?'
    const values = [socketId, id]
    await user.update(sql, values)
    return { message: 'Cập nhật socketId thành công' }
  }
  handleUpdateUserState = async (userId: number, state: string) => {
    const user = new User()
    await user.update('UPDATE users SET isOnline=? WHERE id=?', [state, userId])
    return { message: USER_MESSAGES.UPDATE_PROFILE_SUCCESSFULLY }
  }
}
const userService = new UserService()
export default userService
