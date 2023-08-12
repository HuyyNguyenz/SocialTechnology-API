"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDb_1 = __importDefault(require("~/utils/connectDb"));
class User {
    constructor(username, email, password, firstName, lastName, birthDay, gender, createdAt) {
        this.getAll = async () => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute('SELECT * FROM `users`');
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.getAllByLimit = async (limit, offset) => {
            const connection = await (0, connectDb_1.default)();
            try {
                const [result] = await connection.execute(`SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`);
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
                const [result] = await connection.execute('INSERT INTO `users`(username, email, password, firstName, lastName, birthDay, gender, createdAt) VALUES(?,?,?,?,?,?,?,?)', [
                    this.username,
                    this.email,
                    this.password,
                    this.firstName,
                    this.lastName,
                    this.birthDay,
                    this.gender,
                    this.createdAt
                ]);
                connection.end();
                return result;
            }
            catch (error) {
                return error;
            }
        };
        this.find = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('users')) {
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
                return 'Method is allow for user table';
            }
        };
        this.update = async (sql, values) => {
            const connection = await (0, connectDb_1.default)();
            if (sql.includes('users')) {
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
                return 'Method is allow for user table';
            }
        };
        this.username = username || '';
        this.email = email || '';
        this.password = password || '';
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.birthDay = birthDay || '';
        this.gender = gender || '';
        this.createdAt = createdAt || '';
    }
}
exports.default = User;
