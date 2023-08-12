"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const accessToken = token.split(' ')[1];
        jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (error, user) => {
            if (error) {
                res.status(403).json({ message: 'Token is not valid' });
            }
            else {
                req.headers.user = JSON.stringify(user);
                next();
            }
        });
    }
    else {
        res.status(401).json({ message: "You're not authenticated" });
    }
};
exports.default = verifyToken;
