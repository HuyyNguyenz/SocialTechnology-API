import { FRIEND_MESSAGES } from '~/constants/messages'
import Friend from '../models/Friend'
import Notify from '../models/Notify'
import { FriendType } from '../types/friendTypes'

const friendService = {
  handleGetAllFriend: async () => {
    const friend = new Friend()
    const result = await friend.getAll()
    return result
  },
  handleAddFriend: async (userId: number, data: FriendType) => {
    const { status, friendId } = data
    const friend = new Friend(status, Number(friendId), userId)
    const { insertId } = await friend.insert()
    const notify1 = new Notify('unseen', 'friend', Number(insertId), Number(friendId))
    const notify2 = new Notify('unseen', 'friend', Number(insertId), userId)
    await Promise.all([await notify1.insert(), await notify2.insert()])
    return { message: FRIEND_MESSAGES.SENT_REQUEST_ADD_FRIEND_SUCCESSFULLY }
  },
  handleDeleteFriend: async (id: number) => {
    const friend = new Friend()
    const notify = new Notify()
    await Promise.all([await friend.delete(id), await notify.delete(id, 'friend')])
    return { message: FRIEND_MESSAGES.CANCELED_REQUEST_ADD_FRIEND_SUCCESSFULLY }
  },
  handleAcceptFriend: async (id: number) => {
    const friend = new Friend()
    const sql = 'UPDATE friends SET status=? WHERE id=?'
    const values = ['accept', id]
    await friend.update(sql, values)
    return { message: FRIEND_MESSAGES.ACCEPTED_FRIEND_SUCCESSFULLY }
  }
}

export default friendService
