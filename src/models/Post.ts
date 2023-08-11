import connectDb from '~/utils/connectDb'

class Post {
  content?: string
  createdAt?: string
  modifiedAt?: string
  userId?: number
  communityId?: number
  type?: string
  images?: string
  video?: string
  constructor(
    content?: string,
    createdAt?: string,
    modifiedAt?: string,
    userId?: number,
    communityId?: number,
    type?: string,
    images?: string,
    video?: string
  ) {
    this.content = content || ''
    this.createdAt = createdAt || ''
    this.modifiedAt = modifiedAt || ''
    this.userId = userId
    this.communityId = communityId
    this.type = type || ''
    this.images = images || ''
    this.video = video || ''
  }

  getAll = async (limit: number, offset: number) => {
    const connection = await connectDb()
    try {
      const sql =
        limit === 0 && offset === 0
          ? `SELECT * FROM posts ORDER BY id DESC`
          : `SELECT * FROM posts ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
      const [result]: any = await connection.execute(sql)
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  getAllById = async (userId: number, limit: number, offset: number) => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute(
        `SELECT * FROM posts WHERE userId=${userId} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
      )
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  get = async (id: number) => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute(`SELECT * FROM posts WHERE id=${id}`)
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
        `INSERT INTO posts(content, createdAt, userId, ${
          this.communityId === 0 ? '' : 'communityId,'
        } type, images, video) VALUES(?,?,?,${this.communityId === 0 ? '' : '?,'}?,?,?)`,
        this.communityId === 0
          ? [this.content, this.createdAt, this.userId, this.type, this.images, this.video]
          : [this.content, this.createdAt, this.userId, this.communityId, this.type, this.images, this.video]
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
      const [result]: any = await connection.execute('UPDATE `posts` SET deleted=1 WHERE id=?', [id])
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  find = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('posts')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for posts table'
    }
  }

  update = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('posts')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for posts table'
    }
  }
}

export default Post
