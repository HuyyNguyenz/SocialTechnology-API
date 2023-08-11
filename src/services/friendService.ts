import Friend from '~/models/Friend'
import Notify from '~/models/Notify'
import { FriendType } from '~/types/friendType'

const friendService = {
  handleGetAllFriend: async () => {
    const friend = new Friend()
    const result = await friend.getAll()
    return result
  },
  handleRequestMakeFriend: async (data: FriendType) => {
    const { status, friendId, userId } = data
    const friend = new Friend(status, friendId, userId)
    await friend.insert()
    const friends: FriendType[] = await friend.getAll()
    const friendFound = friends.find((friend) => friend.friendId === friendId && friend.userId === userId)
    const notify1 = new Notify('unseen', 'friend', Number(friendFound?.id), Number(friendFound?.friendId))
    await notify1.insert()
    const notify2 = new Notify('unseen', 'friend', Number(friendFound?.id), Number(friendFound?.userId))
    await notify2.insert()

    return { message: 'Đã gửi lời mời kết bạn', status: 201 }
  },
  handleDeleteFriend: async (id: number) => {
    const friend = new Friend()
    const notify = new Notify()
    await friend.delete(id)
    await notify.delete(id, 'friend')
    return { message: 'Đã gỡ lời mời kết bạn', status: 201 }
  },
  handleAcceptFriend: async (id: number) => {
    const friend = new Friend()
    const sql = "UPDATE friends SET status='accept' WHERE id=?"
    const values = [id]
    await friend.update(sql, values)
    return { message: 'Đã chấp nhận lời mời kết bạn', status: 200 }
  }
}

export default friendService
