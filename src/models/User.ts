import connectDb from '../utils/connectDb'

class User {
  private username?: string
  private email?: string
  private password?: string
  private firstName?: string
  private lastName?: string
  private birthDay?: string
  private gender?: string
  private createdAt?: string
  constructor(
    username?: string,
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    birthDay?: string,
    gender?: string,
    createdAt?: string
  ) {
    this.username = username || ''
    this.email = email || ''
    this.password = password || ''
    this.firstName = firstName || ''
    this.lastName = lastName || ''
    this.birthDay = birthDay || ''
    this.gender = gender || ''
    this.createdAt = createdAt || ''
  }

  getAll = async () => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute('SELECT * FROM `users`')
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  getAllByLimit = async (limit: number, offset: number) => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute(`SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`)
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  insert = async () => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute(
        'INSERT INTO `users`(username, email, password, firstName, lastName, birthDay, gender, createdAt) VALUES(?,?,?,?,?,?,?,?)',
        [
          this.username,
          this.email,
          this.password,
          this.firstName,
          this.lastName,
          this.birthDay,
          this.gender,
          this.createdAt
        ]
      )
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  find = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('users')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for user table'
    }
  }

  update = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('users')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for user table'
    }
  }
}

export default User
