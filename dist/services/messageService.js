"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = __importDefault(require("~/models/Message"));
const Notify_1 = __importDefault(require("~/models/Notify"));
const User_1 = __importDefault(require("~/models/User"));
const messageService = {
    handleGetMessageList: async () => {
        const message = new Message_1.default();
        const result = await message.getAll();
        return result;
    },
    handleAddMessage: async (data) => {
        const images = data.images?.length > 0 ? JSON.stringify(data.images) : '';
        const video = data.video?.name ? JSON.stringify(data.video) : '';
        const message = new Message_1.default(data.content, data.createdAt, '', data.userId, data.friendId, images, video);
        const { insertId } = await message.insert();
        const foundMessage = await message.find('SELECT * FROM messages WHERE id=?', [insertId]);
        const user = new User_1.default();
        const foundUserFriend = await user.find('SELECT * FROM users WHERE id=?', [data.friendId]);
        let status = '';
        if (foundUserFriend[0]?.isOnline === 'true' || foundUserFriend[0]?.isOnline === 'false') {
            status = 'unseen';
        }
        else {
            foundUserFriend[0]?.isOnline?.split('-')[1] === data.userId + '' ? (status = 'seen') : (status = 'unseen');
        }
        const notify = new Notify_1.default(status, 'message', Number(foundMessage[0]?.id), Number(data.friendId));
        await notify.insert();
        return { message: 'Gửi tin nhắn thành công', status: 201 };
    },
    handleDeleteMessage: async (id) => {
        const message = new Message_1.default();
        await message.delete(id);
        return { message: 'Gỡ tin nhắn thành công', status: 201 };
    },
    handleUpdateMessage: async (id, data) => {
        const message = new Message_1.default();
        const sql = 'UPDATE `messages` SET content=?,modifiedAt=?,images=?,video=? WHERE id=?';
        const images = data.images?.length > 0 ? JSON.stringify(data.images) : '';
        const video = data.video?.name ? JSON.stringify(data.video) : '';
        const values = [data.content, data.modifiedAt, images, video, id];
        await message.update(sql, values);
        return { message: 'Cập nhật tin nhắn thành công', status: 200 };
    }
};
exports.default = messageService;
