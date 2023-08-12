"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Friend_1 = __importDefault(require("~/models/Friend"));
const Notify_1 = __importDefault(require("~/models/Notify"));
const friendService = {
    handleGetAllFriend: async () => {
        const friend = new Friend_1.default();
        const result = await friend.getAll();
        return result;
    },
    handleRequestMakeFriend: async (data) => {
        const { status, friendId, userId } = data;
        const friend = new Friend_1.default(status, friendId, userId);
        await friend.insert();
        const friends = await friend.getAll();
        const friendFound = friends.find((friend) => friend.friendId === friendId && friend.userId === userId);
        const notify1 = new Notify_1.default('unseen', 'friend', Number(friendFound?.id), Number(friendFound?.friendId));
        await notify1.insert();
        const notify2 = new Notify_1.default('unseen', 'friend', Number(friendFound?.id), Number(friendFound?.userId));
        await notify2.insert();
        return { message: 'Đã gửi lời mời kết bạn', status: 201 };
    },
    handleDeleteFriend: async (id) => {
        const friend = new Friend_1.default();
        const notify = new Notify_1.default();
        await friend.delete(id);
        await notify.delete(id, 'friend');
        return { message: 'Đã gỡ lời mời kết bạn', status: 201 };
    },
    handleAcceptFriend: async (id) => {
        const friend = new Friend_1.default();
        const sql = "UPDATE friends SET status='accept' WHERE id=?";
        const values = [id];
        await friend.update(sql, values);
        return { message: 'Đã chấp nhận lời mời kết bạn', status: 200 };
    }
};
exports.default = friendService;
