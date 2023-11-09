import { config } from 'dotenv'

config()
export const ENV_CONFIG = {
  HOST: process.env.HOST as string,
  USER: process.env.USER as string,
  DB: process.env.DB as string,
  PASSWORD: process.env.PASSWORD as string,
  PORT: process.env.PORT || 4000,

  CLIENT: process.env.CLIENT as string,

  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY as string,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY as string,

  EMAIL: process.env.EMAIL as string,
  PASS: process.env.PASS as string
} as const
