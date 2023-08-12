"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("~/models/User"));
const verifyEmail = async (req, res, next) => {
    const { email } = req.body;
    if (email) {
        const user = new User_1.default();
        const sql = 'SELECT * FROM `users` WHERE email=?';
        const values = [email];
        const result = await user.find(sql, values);
        if (result.length > 0) {
            req.headers.userEmail = email;
            next();
        }
        else {
            res.status(404).json({ message: 'Email chưa được đăng ký!' });
        }
    }
};
exports.default = verifyEmail;
