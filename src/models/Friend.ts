import connectDb from '../utils/connectDb'

class Friend {
  status?: string
  friendId?: number
  userId?: number

  constructor(status?: string, friendId?: number, userId?: number) {
    this.status = status || ''
    this.friendId = friendId
    this.userId = userId
  }

  getAll = async () => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute('SELECT * FROM friends')
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
        `INSERT INTO friends(status,friendId,userId) VALUES('${this.status}',${this.friendId},${this.userId})`
      )
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  delete = async (id: number) => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute('DELETE FROM `friends` WHERE id=?', [id])
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  find = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('friends')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for friends table'
    }
  }

  update = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('friends')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for friends table'
    }
  }
}

export default Friend
