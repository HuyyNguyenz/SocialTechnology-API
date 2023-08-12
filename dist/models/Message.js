"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDb_1 = __importDefault(require("~/utils/connectDb"));
class Message {
    constructor(content, createdAt, modifiedAt, userId, friendId, images, video) {
        this.getAll = async () => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute('SELECT * FROM `messages`');
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.insert = async () => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute('INSERT INTO messages(content,createdAt,images,video,userId,friendId) VALUES(?,?,?,?,?,?)', [this.content, this.createdAt, this.images, this.video, this.userId, this.friendId]);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.delete = async (id) => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute('UPDATE `messages` SET deleted=1 WHERE id=?', [id]);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.find = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('messages')) {
                try {
                    const [result] = await connection.execute(sql, values);
                    connection.end();
                    return result;
                }
                catch (error) {
                    return error;
                }
            }
            else {
                return 'Method is allow for messages table';
            }
        };
        this.update = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('messages')) {
                try {
                    const [result] = await connection.execute(sql, values);
                    connection.end();
                    return result;
                }
                catch (error) {
                    return error;
                }
            }
            else {
                return 'Method is allow for messages table';
            }
        };
        this.content = content || '';
        this.createdAt = createdAt || '';
        this.modifiedAt = modifiedAt || '';
        this.userId = userId;
        this.friendId = friendId;
        this.images = images || '';
        this.video = video || '';
    }
}
exports.default = Message;
