"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("~/models/User"));
const verifyOtp = async (req, res, next) => {
    const { otpCode, userEmail } = req.body;
    if (otpCode && userEmail) {
        const user = new User_1.default();
        const sql = 'SELECT * FROM `users` WHERE otpCode=? AND email=?';
        const values = [otpCode, userEmail];
        try {
            const [result] = await user.find(sql, values);
            if (result) {
                req.headers.userOtp = JSON.stringify({ otpCode, userEmail });
                next();
            }
            else {
                throw 'Mã xác nhận không chính xác';
            }
        }
        catch (error) {
            res.status(404).json({ message: error });
        }
    }
};
exports.default = verifyOtp;
