import connectDb from '../utils/connectDb'

class Comment {
  content?: string
  createdAt?: string
  modifiedAt?: string
  userId?: number
  postId?: number
  images?: string
  video?: string
  constructor(
    content?: string,
    createdAt?: string,
    modifiedAt?: string,
    userId?: number,
    postId?: number,
    images?: string,
    video?: string
  ) {
    this.content = content || ''
    this.createdAt = createdAt || ''
    this.modifiedAt = modifiedAt || ''
    this.userId = userId
    this.postId = postId
    this.images = images || ''
    this.video = video || ''
  }

  getAll = async () => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute('SELECT * FROM `comments`')
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  getAllById = async (id: number, limit: number, offset: number) => {
    const connection = await connectDb()
    try {
      const sql =
        limit === 0 && offset === 0
          ? `SELECT * FROM comments WHERE postId=${id} ORDER BY id DESC`
          : `SELECT * FROM comments WHERE postId=${id} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
      const [result]: any = await connection.execute(sql)
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
        'INSERT INTO comments(content,createdAt,images,video,userId,postId) VALUES(?,?,?,?,?,?)',
        [this.content, this.createdAt, this.images, this.video, this.userId, this.postId]
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
      const [result]: any = await connection.execute('UPDATE `comments` SET deleted=1 WHERE id=?', [id])
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  find = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('comments')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for comments table'
    }
  }

  update = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('comments')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for comments table'
    }
  }
}

export default Comment
