"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("~/models/User"));
const verifyUser = async (req, res, next) => {
    const { email } = req.body;
    if (email.includes('@')) {
        const user = new User_1.default();
        const sql = 'SELECT * FROM `users` WHERE email=?';
        const values = [email];
        const [result] = await user.find(sql, values);
        result && result.verify === 'true'
            ? next()
            : res.status(401).json({
                message: result ? 'Tài khoản của bạn chưa xác thực. Vui lòng kiểm tra email' : 'Sai thông tin đăng nhập',
                status: 401
            });
    }
    else {
        res.status(401).json({ message: 'Sai thông tin đăng nhập', status: 401 });
    }
};
exports.default = verifyUser;
