import md5 from 'md5'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import User from '../models/User'
import { UserType } from '../types/userType'
import { emailGen } from '../utils/email'
import { USER_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { config } from 'dotenv'

config()
class UserService {
  generateAccessToken = (userId: number, expiresIn: string) => {
    return jwt.sign(
      {
        id: userId
      },
      process.env.ACCESS_TOKEN_KEY as string,
      { expiresIn }
    )
  }
  generateRefreshToken = (userId: number, expiresIn: string) => {
    return jwt.sign(
      {
        id: userId
      },
      process.env.REFRESH_TOKEN_KEY as string,
      { expiresIn }
    )
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
    const accessToken = this.generateAccessToken(Number(userData.id), '300s')
    const refreshToken = this.generateRefreshToken(Number(userData.id), '365d')
    const user = new User()
    const sql = 'UPDATE users SET token=? WHERE id=?'
    const values = [refreshToken, Number(userData.id)]
    await user.update(sql, values)
    return { message: USER_MESSAGES.LOGIN_SUCCESSFULLY, accessToken, refreshToken }
  }
  handleGetUser = async (userId: string) => {
    const user = new User()
    const sql = 'SELECT * FROM `users` WHERE id=? OR username=? OR token=?'
    const values = [userId, userId, userId]
    const result = await user.find(sql, values)
    if (result.length > 0) {
      const { password, token, otpCode, socketId, ...data } = result[0]
      return { data, status: 200 }
    } else {
      return { message: 'Không tìm thấy', status: 404 }
    }
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
    const accessToken = userService.generateAccessToken(userId, '300s')
    const refreshToken = userService.generateRefreshToken(userId, exp + '')
    const sql = 'UPDATE users SET token=? WHERE id=?'
    const values = [refreshToken, userId]
    await user.update(sql, values)
    return { message: USER_MESSAGES.REFRESH_TOKEN_SUCCESSFULLY, accessToken, refreshToken }
  }
  handleSearch = async (searchValue: string) => {
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
    return { message: 'Otp code sent to email. Please check your email' }
  }
  handleUpdatePassword = async (password: string, email: string) => {
    const hashPassword = md5(password)
    const user = new User()
    const sql = 'UPDATE users SET password=?,otpCode=null WHERE email=?'
    const values = [hashPassword, email]
    await user.update(sql, values)
    return { message: USER_MESSAGES.UPDATE_PASSWORD_SUCCESSFULLY }
  }
  handleUpdateProfile = async (id: number, data: UserType) => {
    const user = new User()
    const { firstName, lastName, birthDay, gender, avatar, backgroundImage } = data
    const sql = 'UPDATE `users` SET firstName=?,lastName=?,birthDay=?,gender=?,avatar=?,backgroundImage=? WHERE id=?'
    const avatarString = avatar?.name !== '' ? JSON.stringify(avatar) : ''
    const backgroundImageString = backgroundImage?.name !== '' ? JSON.stringify(backgroundImage) : ''
    const values = [firstName, lastName, birthDay, gender, avatarString, backgroundImageString, id]
    await user.update(sql, values)
    return { message: 'Cập nhật thành công' }
  }
  handleUpdateSocketId = async (id: number, socketId: string) => {
    const user = new User()
    const sql = 'UPDATE users SET socketId=? WHERE id=?'
    const values = [socketId, id]
    await user.update(sql, values)
    return { message: 'Cập nhật socketId thành công' }
  }
  handleUpdateUserState = async (id: number, state: string) => {
    const user = new User()
    await user.update('UPDATE users SET isOnline=? WHERE id=?', [state, id])
    return { message: 'Cập nhật trạng thái thành công' }
  }
}
const userService = new UserService()
export default userService
