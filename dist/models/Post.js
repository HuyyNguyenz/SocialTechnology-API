"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDb_1 = __importDefault(require("~/utils/connectDb"));
class Post {
    constructor(content, createdAt, modifiedAt, userId, communityId, type, images, video) {
        this.getAll = async (limit, offset) => {
            const connection = await (0, connectDb_1.default)();
            try {
                const sql = limit === 0 && offset === 0
                    ? `SELECT * FROM posts ORDER BY id DESC`
                    : `SELECT * FROM posts ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
                const [result] = await connection.execute(sql);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.getAllById = async (userId, limit, offset) => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute(`SELECT * FROM posts WHERE userId=${userId} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.get = async (id) => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute(`SELECT * FROM posts WHERE id=${id}`);
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
                const [result] = await connection.execute(`INSERT INTO posts(content, createdAt, userId, ${this.communityId === 0 ? '' : 'communityId,'} type, images, video) VALUES(?,?,?,${this.communityId === 0 ? '' : '?,'}?,?,?)`, this.communityId === 0
                    ? [this.content, this.createdAt, this.userId, this.type, this.images, this.video]
                    : [this.content, this.createdAt, this.userId, this.communityId, this.type, this.images, this.video]);
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
                const [result] = await connection.execute('UPDATE `posts` SET deleted=1 WHERE id=?', [id]);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.find = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('posts')) {
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
                return 'Method is allow for posts table';
            }
        };
        this.update = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('posts')) {
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
                return 'Method is allow for posts table';
            }
        };
        this.content = content || '';
        this.createdAt = createdAt || '';
        this.modifiedAt = modifiedAt || '';
        this.userId = userId;
        this.communityId = communityId;
        this.type = type || '';
        this.images = images || '';
        this.video = video || '';
    }
}
exports.default = Post;
