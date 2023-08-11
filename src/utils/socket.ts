import { Server } from 'socket.io'
import User from '../models/User'
import Post from '../models/Post'
import { PostType } from '../types/postType'
import { UserType } from '../types/userType'
import Friend from '~/models/Friend'
import { FriendType } from '~/types/friendType'

const socketIo = new Server({
  cors: {
    origin: process.env.CLIENT
  }
})
const portSocket = Number(process.env.PORT_SOCKET)

socketIo.on('connection', (socket) => {
  socket.on('sendDataClient', async (data) => {
    const post = new Post()
    const foundPost: PostType[] = await post.find('SELECT * FROM posts WHERE id=?', [data.postId])
    const user = new User()
    const foundUserFriend: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [data.userId])
    const foundUser: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [foundPost[0]?.userId])
    const socketId = foundUser[0]?.socketId as string

    data.userId !== foundPost[0]?.userId &&
      socketIo.to(socketId).emit('sendCommentNotify', {
        message: `${foundUserFriend[0]?.firstName} ${foundUserFriend[0]?.lastName} đã bình luận vào bài viết của bạn`,
        userId: foundUser[0]?.id
      })
  })

  socket.on('sendMessageClient', async (data) => {
    const user = new User()
    const foundUser: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [data.friendId])
    const socketUserId = foundUser[0]?.socketId as string
    const isAttend = foundUser[0]?.isOnline?.includes('p-') ? true : false
    socket.to(socketUserId).emit('sendMessageNotify', { userId: data.friendId, isAttend, status: data.status })
  })

  socket.on('sendRequestClient', async (data) => {
    const user = new User()
    if (data.id) {
      const friend = new Friend()
      const foundFriend: FriendType[] = await friend.find('SELECT * FROM friends WHERE id=?', [data.id])
      const foundUserFriend: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [foundFriend[0]?.friendId])
      const foundUser: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [foundFriend[0]?.userId])
      const socketId = foundUser[0]?.socketId as string
      socketIo.to(socketId).emit('sendAcceptFriendNotify', {
        message: `${foundUserFriend[0]?.firstName} ${foundUserFriend[0]?.lastName} đã chấp nhận lời mời kết bạn của bạn`,
        userId: foundUser[0]?.id
      })
    } else {
      const foundUser: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [data.userId])
      const foundUserFriend: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [data.friendId])
      const socketId = foundUserFriend[0]?.socketId as string
      socketIo.to(socketId).emit('sendInviteFriendNotify', {
        message: `${foundUser[0]?.firstName} ${foundUser[0]?.lastName} đã gửi cho bạn lời mời kết bạn`,
        userId: foundUserFriend[0]?.id
      })
    }
  })

  socket.on('sendRequestRemoveClient', async (data) => {
    const user = new User()
    const foundUser: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [data.userId])
    const socketUserId = foundUser[0]?.socketId as string
    socketIo.to(socketUserId).emit('sendRemoveInviteFriendNotify', {
      userId: foundUser[0]?.id
    })
  })

  socket.on('sendRequestOnlineClient', async (data) => {
    data.userId && socketIo.emit('sendStatusActive')
  })

  socket.on('sendRequestOfflineClient', async (data) => {
    const user = new User()
    await user.update("UPDATE users SET isOnline='false' WHERE id=?", [data.userId])
    socketIo.emit('sendStatusActive')
  })

  socket.on('startingCallUser', async (data) => {
    const { from, to } = data
    const user = new User()
    const receiver: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [to.id])
    socketIo.to(receiver[0].socketId as string).emit('receiveCall', { caller: from })
  })

  socket.on('callUser', async (data) => {
    const { userToCall, signalData } = data
    const user = new User()
    const receiver: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [userToCall])
    socketIo.to(receiver[0].socketId as string).emit('receiveCallUser', { signalData })
  })

  socket.on('pendingCall', async (data) => {
    const { from, to } = data
    const user = new User()
    const caller: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [from.id])
    socketIo.to(caller[0].socketId as string).emit('pendingStatusCall', { receiver: to })
  })

  socket.on('answerCall', async (data) => {
    const { signal, to } = data
    const user = new User()
    const receiver: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [to])
    socketIo.to(receiver[0].socketId as string).emit('callAccepted', { signal })
  })

  socket.on('cancelledCall', async (data) => {
    const { from } = data
    const user = new User()
    const userReceiveCall: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [from.id])
    socketIo.to(userReceiveCall[0].socketId as string).emit('callEnded')
  })

  socket.on('sendStatusCamera', async (data) => {
    const { id, camera } = data
    const user = new User()
    const userData: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [id])
    socketIo.to(userData[0].socketId as string).emit('receiveStatusCamera', { camera })
  })

  socket.on('sendStatusMicro', async (data) => {
    const { id, micro } = data
    const user = new User()
    const userData: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [id])
    socketIo.to(userData[0].socketId as string).emit('receiveStatusMicro', { micro })
  })

  socket.on('sendUserLikedPost', async (data) => {
    const { userId, postId, receiverId } = data
    const user = new User()
    const receiver: UserType[] = await user.find('SELECT * FROM users WHERE id=?', [receiverId])
    socketIo.to(receiver[0].socketId as string).emit('receiveUserLikedPost', { userId, postId })
  })

  socket.on('disconnect', async () => {
    const user = new User()
    await user.update("UPDATE users SET isOnline='false' WHERE socketId=?", [socket.id])
    socketIo.emit('sendStatusActive')
  })
})
socketIo.listen(portSocket)
