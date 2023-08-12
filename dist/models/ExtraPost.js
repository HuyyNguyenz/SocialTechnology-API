"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDb_1 = __importDefault(require("~/utils/connectDb"));
class ExtraPost {
    constructor(userId, postId, type) {
        this.getAll = async () => {
            const connection = await (0, connectDb_1.default)();
            try {
                const sql = 'SELECT * FROM feature_extra_posts';
                const [result] = await connection.execute(sql);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.getAllById = async (postId, type) => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute('SELECT * FROM feature_extra_posts WHERE postId=? AND type=?', [
                    postId,
                    type
                ]);
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
                const [result] = await connection.execute('INSERT INTO feature_extra_posts(userId,postId,type) VALUES(?,?,?)', [this.userId, this.postId, this.type]);
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
                const [result] = await connection.execute('DELETE FROM feature_extra_posts WHERE id=?', [id]);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.find = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('feature_extra_posts')) {
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
                return 'Method is allow for feature_extra_posts table';
            }
        };
        this.update = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('feature_extra_posts')) {
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
                return 'Method is allow for feature_extra_posts table';
            }
        };
        this.userId = userId;
        this.postId = postId;
        this.type = type || '';
    }
}
exports.default = ExtraPost;
