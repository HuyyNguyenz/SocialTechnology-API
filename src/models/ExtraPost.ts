import connectDb from '../utils/connectDb'

class ExtraPost {
  userId?: number
  postId?: number
  type?: string
  constructor(userId?: number, postId?: number, type?: string) {
    this.userId = userId
    this.postId = postId
    this.type = type || ''
  }

  getAll = async () => {
    const connection = await connectDb()
    try {
      const sql = 'SELECT * FROM feature_extra_posts'
      const [result]: any = await connection.execute(sql)
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  getAllById = async (postId: number, type: string) => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute('SELECT * FROM feature_extra_posts WHERE postId=? AND type=?', [
        postId,
        type
      ])
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
        'INSERT INTO feature_extra_posts(userId,postId,type) VALUES(?,?,?)',
        [this.userId, this.postId, this.type]
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
      const [result]: any = await connection.execute('DELETE FROM feature_extra_posts WHERE id=?', [id])
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  find = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('feature_extra_posts')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for feature_extra_posts table'
    }
  }

  update = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('feature_extra_posts')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for feature_extra_posts table'
    }
  }
}

export default ExtraPost
