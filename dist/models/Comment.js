"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDb_1 = __importDefault(require("~/utils/connectDb"));
class Comment {
    constructor(content, createdAt, modifiedAt, userId, postId, images, video) {
        this.getAll = async () => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute('SELECT * FROM `comments`');
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.getAllById = async (id, limit, offset) => {
            const connection = await (0, connectDb_1.default)();
            try {
                const sql = limit === 0 && offset === 0
                    ? `SELECT * FROM comments WHERE postId=${id} ORDER BY id DESC`
                    : `SELECT * FROM comments WHERE postId=${id} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
                const [result] = await connection.execute(sql);
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
                const [result] = await connection.execute('INSERT INTO comments(content,createdAt,images,video,userId,postId) VALUES(?,?,?,?,?,?)', [this.content, this.createdAt, this.images, this.video, this.userId, this.postId]);
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
                const [result] = await connection.execute('UPDATE `comments` SET deleted=1 WHERE id=?', [id]);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.find = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('comments')) {
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
                return 'Method is allow for comments table';
            }
        };
        this.update = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('comments')) {
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
                return 'Method is allow for comments table';
            }
        };
        this.content = content || '';
        this.createdAt = createdAt || '';
        this.modifiedAt = modifiedAt || '';
        this.userId = userId;
        this.postId = postId;
        this.images = images || '';
        this.video = video || '';
    }
}
exports.default = Comment;
