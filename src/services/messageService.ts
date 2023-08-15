import Message from '../models/Message'
import Notify from '../models/Notify'
import User from '../models/User'
import { MessageType } from '../types/messageType'
import { UserType } from '../types/userType'

const messageService = {
  handleGetMessageList: async () => {
    const message = new Message()
    const result = await message.getAll()
    return result
  },
  handleAddMessage: async (data: MessageType) => {
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const message = new Message(data.content, data.createdAt, '', data.userId, data.friendId, images, video)
    const { insertId } = await message.insert()
    const foundMessage: MessageType[] = await message.find('SELECT * FROM messages WHERE id=?', [insertId])
    const user = new User()
    const foundUserFriend: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [data.friendId])
    let status = ''
    if (foundUserFriend[0]?.isOnline === 'true' || foundUserFriend[0]?.isOnline === 'false') {
      status = 'unseen'
    } else {
      foundUserFriend[0]?.isOnline?.split('-')[1] === data.userId + '' ? (status = 'seen') : (status = 'unseen')
    }

    const notify = new Notify(status, 'message', Number(foundMessage[0]?.id), Number(data.friendId))
    await notify.insert()
    return { message: 'Gửi tin nhắn thành công', status: 201 }
  },
  handleDeleteMessage: async (id: number) => {
    const message = new Message()
    await message.delete(id)
    return { message: 'Gỡ tin nhắn thành công', status: 201 }
  },
  handleUpdateMessage: async (id: number, data: MessageType) => {
    const message = new Message()
    const sql = 'UPDATE `messages` SET content=?,modifiedAt=?,images=?,video=? WHERE id=?'
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const values = [data.content, data.modifiedAt, images, video, id]
    await message.update(sql, values)
    return { message: 'Cập nhật tin nhắn thành công', status: 200 }
  }
}

export default messageService
