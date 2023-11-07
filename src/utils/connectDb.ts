import mysql from 'mysql2/promise'
import { config } from 'dotenv'

config()

const host = process.env.HOST || 'localhost'
const user = process.env.USER || 'root'
const database = process.env.DB
const password = process.env.PASSWORD || ''

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
