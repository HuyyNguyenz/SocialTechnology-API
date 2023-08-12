"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailGen = void 0;
const mailgen_1 = __importDefault(require("mailgen"));
const emailGen = (username, brand, link, value, intro, instructions) => {
    const mailGenerator = new mailgen_1.default({
        theme: 'default',
        product: {
            name: brand,
            link: 'http://127.0.0.1:3000/',
            logo: 'https://firebasestorage.googleapis.com/v0/b/social-technology.appspot.com/o/logo%2Flogo.png?alt=media&token=016d60da-01e4-4a22-a8aa-3f37e8401889'
        }
    });
    const email = {
        body: {
            name: username,
            intro: intro ? intro : 'Xin vui lòng không chia sẻ mã này cho bất cứ ai!',
            action: {
                instructions: instructions
                    ? instructions
                    : 'Để tiếp tục khôi phục mật khẩu. Bạn cần nhập mã này vào trang khôi phục mật khẩu',
                button: {
                    color: '#9F18F2',
                    text: value,
                    link
                }
            },
            outro: 'Mọi ý kiến thắc mắc. Xin vui lòng phản hồi lại email này'
        }
    };
    const emailBody = mailGenerator.generate(email);
    return emailBody;
};
exports.emailGen = emailGen;
