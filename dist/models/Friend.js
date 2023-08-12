"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDb_1 = __importDefault(require("~/utils/connectDb"));
class Friend {
    constructor(status, friendId, userId) {
        this.getAll = async () => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute('SELECT * FROM `friends`');
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
                const [result] = await connection.execute(`INSERT INTO friends(status,friendId,userId) VALUES('${this.status}',${this.friendId},${this.userId})`);
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
                const [result] = await connection.execute('DELETE FROM `friends` WHERE id=?', [id]);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.find = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('friends')) {
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
                return 'Method is allow for friends table';
            }
        };
        this.update = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('friends')) {
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
                return 'Method is allow for friends table';
            }
        };
        this.status = status || '';
        this.friendId = friendId;
        this.userId = userId;
    }
}
exports.default = Friend;
