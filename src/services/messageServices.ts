import { MESSAGE_MESSAGES } from '~/constants/messages'
import Message from '../models/Message'
import Notify from '../models/Notify'
import { MessageType } from '../types/messageTypes'
import { UserType } from '../types/userTypes'
import { UpdateMessageReqBody } from '~/requestTypes'

const messageService = {
  handleGetMessageList: async () => {
    const message = new Message()
    const result = await message.getAll()
    return result
  },
  handleAddMessage: async (userId: number, data: MessageType, friend: UserType) => {
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const message = new Message(data.content, data.createdAt, '', userId, data.friendId, images, video)
    const { insertId } = await message.insert()
    let status = ''
    if (friend.isOnline === 'true' || friend.isOnline === 'false') {
      status = 'unseen'
    } else {
      friend.isOnline?.split('-')[1] === userId + '' ? (status = 'seen') : (status = 'unseen')
    }
    const notify = new Notify(status, 'message', Number(insertId), Number(data.friendId))
    await notify.insert()
    return { message: MESSAGE_MESSAGES.SENT_MESSAGE_SUCCESSFULLY }
  },
  handleDeleteMessage: async (id: number, userId: number) => {
    const message = new Message()
    await message.delete(id, userId)
    return { message: MESSAGE_MESSAGES.DELETE_MESSAGE_SUCCESSFULLY }
  },
  handleUpdateMessage: async (id: number, data: UpdateMessageReqBody, userId: number) => {
    const message = new Message()
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const sql = `UPDATE messages SET ${data.content ? `content='${data.content}'` : ''}${
      data.modifiedAt ? `,modifiedAt='${data.modifiedAt}'` : ''
    }${images ? `,images='${images}'` : ''}${video ? `,video='${video}'` : ''}WHERE id=${id} AND userId=${userId}`
    await message.update(sql, [])
    return { message: MESSAGE_MESSAGES.UPDATE_MESSAGE_SUCCESSFULLY }
  }
}

export default messageService
