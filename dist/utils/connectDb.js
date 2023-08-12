"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const host = process.env.HOST || 'localhost';
const user = process.env.USER || 'root';
const database = process.env.DB;
const password = process.env.PASSWORD || '';
const connectDb = async () => {
    const pool = await promise_1.default.createPool({
        host,
        user,
        password,
        database,
        connectionLimit: 10 // Đặt số lượng kết nối tối đa
    });
    return pool;
};
exports.default = connectDb;
