"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const Friend_1 = __importDefault(require("~/models/Friend"));
const socketIo = new socket_io_1.Server({
    cors: {
        origin: process.env.CLIENT
    }
});
const portSocket = Number(process.env.PORT_SOCKET);
socketIo.on('connection', (socket) => {
    socket.on('sendDataClient', async (data) => {
        const post = new Post_1.default();
        const foundPost = await post.find('SELECT * FROM posts WHERE id=?', [data.postId]);
        const user = new User_1.default();
        const foundUserFriend = await user.find('SELECT * FROM users WHERE id=?', [data.userId]);
        const foundUser = await user.find('SELECT * FROM users WHERE id=?', [foundPost[0]?.userId]);
        const socketId = foundUser[0]?.socketId;
        data.userId !== foundPost[0]?.userId &&
            socketIo.to(socketId).emit('sendCommentNotify', {
                message: `${foundUserFriend[0]?.firstName} ${foundUserFriend[0]?.lastName} đã bình luận vào bài viết của bạn`,
                userId: foundUser[0]?.id
            });
    });
    socket.on('sendMessageClient', async (data) => {
        const user = new User_1.default();
        const foundUser = await user.find('SELECT * FROM users WHERE id=?', [data.friendId]);
        const socketUserId = foundUser[0]?.socketId;
        const isAttend = foundUser[0]?.isOnline?.includes('p-') ? true : false;
        socket.to(socketUserId).emit('sendMessageNotify', { userId: data.friendId, isAttend, status: data.status });
    });
    socket.on('sendRequestClient', async (data) => {
        const user = new User_1.default();
        if (data.id) {
            const friend = new Friend_1.default();
            const foundFriend = await friend.find('SELECT * FROM friends WHERE id=?', [data.id]);
            const foundUserFriend = await user.find('SELECT * FROM users WHERE id=?', [foundFriend[0]?.friendId]);
            const foundUser = await user.find('SELECT * FROM users WHERE id=?', [foundFriend[0]?.userId]);
            const socketId = foundUser[0]?.socketId;
            socketIo.to(socketId).emit('sendAcceptFriendNotify', {
                message: `${foundUserFriend[0]?.firstName} ${foundUserFriend[0]?.lastName} đã chấp nhận lời mời kết bạn của bạn`,
                userId: foundUser[0]?.id
            });
        }
        else {
            const foundUser = await user.find('SELECT * FROM users WHERE id=?', [data.userId]);
            const foundUserFriend = await user.find('SELECT * FROM users WHERE id=?', [data.friendId]);
            const socketId = foundUserFriend[0]?.socketId;
            socketIo.to(socketId).emit('sendInviteFriendNotify', {
                message: `${foundUser[0]?.firstName} ${foundUser[0]?.lastName} đã gửi cho bạn lời mời kết bạn`,
                userId: foundUserFriend[0]?.id
            });
        }
    });
    socket.on('sendRequestRemoveClient', async (data) => {
        const user = new User_1.default();
        const foundUser = await user.find('SELECT * FROM users WHERE id=?', [data.userId]);
        const socketUserId = foundUser[0]?.socketId;
        socketIo.to(socketUserId).emit('sendRemoveInviteFriendNotify', {
            userId: foundUser[0]?.id
        });
    });
    socket.on('sendRequestOnlineClient', async (data) => {
        data.userId && socketIo.emit('sendStatusActive');
    });
    socket.on('sendRequestOfflineClient', async (data) => {
        const user = new User_1.default();
        await user.update("UPDATE users SET isOnline='false' WHERE id=?", [data.userId]);
        socketIo.emit('sendStatusActive');
    });
    socket.on('startingCallUser', async (data) => {
        const { from, to } = data;
        const user = new User_1.default();
        const receiver = await user.find('SELECT * FROM users WHERE id=?', [to.id]);
        socketIo.to(receiver[0].socketId).emit('receiveCall', { caller: from });
    });
    socket.on('callUser', async (data) => {
        const { userToCall, signalData } = data;
        const user = new User_1.default();
        const receiver = await user.find('SELECT * FROM users WHERE id=?', [userToCall]);
        socketIo.to(receiver[0].socketId).emit('receiveCallUser', { signalData });
    });
    socket.on('pendingCall', async (data) => {
        const { from, to } = data;
        const user = new User_1.default();
        const caller = await user.find('SELECT * FROM users WHERE id=?', [from.id]);
        socketIo.to(caller[0].socketId).emit('pendingStatusCall', { receiver: to });
    });
    socket.on('answerCall', async (data) => {
        const { signal, to } = data;
        const user = new User_1.default();
        const receiver = await user.find('SELECT * FROM users WHERE id=?', [to]);
        socketIo.to(receiver[0].socketId).emit('callAccepted', { signal });
    });
    socket.on('cancelledCall', async (data) => {
        const { from } = data;
        const user = new User_1.default();
        const userReceiveCall = await user.find('SELECT * FROM users WHERE id=?', [from.id]);
        socketIo.to(userReceiveCall[0].socketId).emit('callEnded');
    });
    socket.on('sendStatusCamera', async (data) => {
        const { id, camera } = data;
        const user = new User_1.default();
        const userData = await user.find('SELECT * FROM users WHERE id=?', [id]);
        socketIo.to(userData[0].socketId).emit('receiveStatusCamera', { camera });
    });
    socket.on('sendStatusMicro', async (data) => {
        const { id, micro } = data;
        const user = new User_1.default();
        const userData = await user.find('SELECT * FROM users WHERE id=?', [id]);
        socketIo.to(userData[0].socketId).emit('receiveStatusMicro', { micro });
    });
    socket.on('sendUserLikedPost', async (data) => {
        const { userId, postId, receiverId } = data;
        const user = new User_1.default();
        const receiver = await user.find('SELECT * FROM users WHERE id=?', [receiverId]);
        socketIo.to(receiver[0].socketId).emit('receiveUserLikedPost', { userId, postId });
    });
    socket.on('disconnect', async () => {
        const user = new User_1.default();
        await user.update("UPDATE users SET isOnline='false' WHERE socketId=?", [socket.id]);
        socketIo.emit('sendStatusActive');
    });
});
socketIo.listen(portSocket);
