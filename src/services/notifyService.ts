import Notify from '../models/Notify'

const notifyService = {
  handleGetNotifyList: async () => {
    const notify = new Notify()
    const result = await notify.getAll()
    return result
  },
  handleUpdateNotify: async (id: number, receiverId: number) => {
    const notify = new Notify()
    const sql = "UPDATE notifies SET status='seen' WHERE id=? AND receiverId=?"
    const values = [id, receiverId]
    await notify.update(sql, values)
    return { message: 'Cập nhật thông báo thành công', status: 200 }
  }
}

export default notifyService
