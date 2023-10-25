import { NOTIFY_MESSAGES } from '~/constants/messages'
import Notify from '../models/Notify'

const notifyService = {
  handleGetNotifyList: async () => {
    const notify = new Notify()
    const result = await notify.getAll()
    return result
  },
  handleUpdateNotify: async (id: number, receiverId: number) => {
    const notify = new Notify()
    const sql = 'UPDATE notifies SET status=? WHERE id=? AND receiverId=?'
    const values = ['seen', id, receiverId]
    await notify.update(sql, values)
    return { message: NOTIFY_MESSAGES.UPDATE_NOTIFY_SUCCESSFULLY }
  }
}

export default notifyService
