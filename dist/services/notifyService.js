"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Notify_1 = __importDefault(require("~/models/Notify"));
const notifyService = {
    handleGetNotifyList: async () => {
        const notify = new Notify_1.default();
        const result = await notify.getAll();
        return result;
    },
    handleUpdateNotify: async (id, receiverId) => {
        const notify = new Notify_1.default();
        const sql = "UPDATE notifies SET status='seen' WHERE id=? AND receiverId=?";
        const values = [id, receiverId];
        await notify.update(sql, values);
        return { message: 'Cập nhật thông báo thành công', status: 200 };
    }
};
exports.default = notifyService;
