import connectDb from '../utils/connectDb'

class Message {
  content?: string
  createdAt?: string
  modifiedAt?: string
  userId?: number
  friendId?: number
  images?: string
  video?: string
  constructor(
    content?: string,
    createdAt?: string,
    modifiedAt?: string,
    userId?: number,
    friendId?: number,
    images?: string,
    video?: string
  ) {
    this.content = content || ''
    this.createdAt = createdAt || ''
    this.modifiedAt = modifiedAt || ''
    this.userId = userId
    this.friendId = friendId
    this.images = images || ''
    this.video = video || ''
  }

  getAll = async () => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute('SELECT * FROM messages')
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
        'INSERT INTO messages(content,createdAt,images,video,userId,friendId) VALUES(?,?,?,?,?,?)',
        [this.content, this.createdAt, this.images, this.video, this.userId, this.friendId]
      )
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  delete = async (id: number, userId: number) => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute('UPDATE messages SET deleted=1 WHERE id=? AND userId=?', [
        id,
        userId
      ])
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  find = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('messages')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for messages table'
    }
  }

  update = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('messages')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for messages table'
    }
  }
}

export default Message
