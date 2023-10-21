import connectDb from '../utils/connectDb'

class Notify {
  status?: string
  type?: string
  typeId?: number
  receiverId?: number

  constructor(status?: string, type?: string, typeId?: number, receiverId?: number) {
    this.status = status || ''
    this.type = type || ''
    this.typeId = typeId
    this.receiverId = receiverId
  }

  getAll = async () => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute('SELECT * FROM `notifies`')
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
        `INSERT INTO notifies(status,type,typeId,receiverId) VALUES('${this.status}','${this.type}',${this.typeId},${this.receiverId})`
      )
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  delete = async (id: number, type: string) => {
    const connection = await connectDb()
    try {
      const [result]: any = await connection.execute('DELETE FROM notifies WHERE typeId=? AND type=?', [id, type])
      connection.end()
      return result
    } catch (error) {
      return error
    }
  }

  find = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('notifies')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for notifies table'
    }
  }

  update = async (sql: string, values: any[]) => {
    const connection = await connectDb()
    if (sql.includes('notifies')) {
      try {
        const [result]: any = await connection.execute(sql, values)
        connection.end()
        return result
      } catch (error) {
        return error
      }
    } else {
      return 'Method is allow for notifies table'
    }
  }
}

export default Notify
