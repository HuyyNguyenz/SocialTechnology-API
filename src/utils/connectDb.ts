import mysql from 'mysql2/promise'
import { ENV_CONFIG } from '~/constants/config'

const host = ENV_CONFIG.HOST || 'localhost'
const user = ENV_CONFIG.USER || 'root'
const database = ENV_CONFIG.DB
const password = ENV_CONFIG.PASSWORD || ''

const connectDb = async () => {
  const pool = await mysql.createPool({
    host,
    user,
    password,
    database,
    connectionLimit: 10 // Đặt số lượng kết nối tối đa
  })
  return pool
}

export default connectDb
