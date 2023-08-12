"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDb_1 = __importDefault(require("~/utils/connectDb"));
class Notify {
    constructor(status, type, typeId, receiverId) {
        this.getAll = async () => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute('SELECT * FROM `notifies`');
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
                const [result] = await connection.execute(`INSERT INTO notifies(status,type,typeId,receiverId) VALUES('${this.status}','${this.type}',${this.typeId},${this.receiverId})`);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.delete = async (id, type) => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute('DELETE FROM `notifies` WHERE type=? AND typeId=?', [type, id]);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.find = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('notifies')) {
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
                return 'Method is allow for notifies table';
            }
        };
        this.update = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('notifies')) {
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
                return 'Method is allow for notifies table';
            }
        };
        this.status = status || '';
        this.type = type || '';
        this.typeId = typeId;
        this.receiverId = receiverId;
    }
}
exports.default = Notify;
