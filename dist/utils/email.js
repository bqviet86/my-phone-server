"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPasswordAdminEmail = exports.sendForgotPasswordEmail = exports.sendVerifyRegisterEmail = exports.sendVerifyEmail = void 0;
/* eslint-disable no-undef */
const client_ses_1 = require("@aws-sdk/client-ses");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
(0, dotenv_1.config)();
// Create SES service object.
const sesClient = new client_ses_1.SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID
    }
});
const emailTemplate = fs_1.default.readFileSync(path_1.default.resolve('src/templates/verify-email.html'), 'utf-8');
const createSendEmailCommand = ({ fromAddress, toAddresses, ccAddresses = [], body, subject, replyToAddresses = [] }) => {
    return new client_ses_1.SendEmailCommand({
        Destination: {
            /* required */
            CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
            ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: 'UTF-8',
                    Data: body
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: fromAddress,
        ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
    });
};
const sendVerifyEmail = (toAddress, subject, body) => {
    const sendEmailCommand = createSendEmailCommand({
        fromAddress: process.env.AWS_SES_FROM_ADDRESS,
        toAddresses: toAddress,
        body,
        subject
    });
    return sesClient.send(sendEmailCommand);
};
exports.sendVerifyEmail = sendVerifyEmail;
const sendVerifyRegisterEmail = (toAddress, email_verify_token, template = emailTemplate) => {
    return (0, exports.sendVerifyEmail)(toAddress, 'Xác thực tài khoản MyPhone', template
        .replace('{{title}}', 'Xác thực tài khoản của bạn')
        .replace('{{content-1}}', 'Cảm ơn bạn đã đăng ký tài khoản trên Myphone!')
        .replace('{{content-2}}', 'Vui lòng nhấn vào nút bên dưới để xác thực tài khoản của bạn')
        .replace('{{link}}', `${process.env.CLIENT_URL}/email-verifications?token=${email_verify_token}`)
        .replace('{{titleLink}}', 'Xác thực'));
};
exports.sendVerifyRegisterEmail = sendVerifyRegisterEmail;
const sendForgotPasswordEmail = (toAddress, forgot_password_token, template = emailTemplate) => {
    return (0, exports.sendVerifyEmail)(toAddress, 'Xác nhận đặt lại mật khẩu MyPhone', template
        .replace('{{title}}', 'Đặt lại mật khẩu của bạn')
        .replace('{{content-1}}', 'Bạn đã yêu cầu đặt lại mật khẩu trên Myphone?')
        .replace('{{content-2}}', 'Nếu là bạn, vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu')
        .replace('{{link}}', `${process.env.CLIENT_URL}/forgot-password?token=${forgot_password_token}`)
        .replace('{{titleLink}}', 'Đặt lại mật khẩu'));
};
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
const sendForgotPasswordAdminEmail = (toAddress, forgot_password_token, template = emailTemplate) => {
    return (0, exports.sendVerifyEmail)(toAddress, 'Xác nhận đặt lại mật khẩu admin của MyPhone', template
        .replace('{{title}}', 'Đặt lại mật khẩu admin của bạn')
        .replace('{{content-1}}', 'Bạn đã yêu cầu đặt lại mật khẩu admin trên Myphone?')
        .replace('{{content-2}}', 'Nếu là bạn, vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu')
        .replace('{{link}}', `${process.env.CLIENT_URL}/forgot-password?admin=true&token=${forgot_password_token}`)
        .replace('{{titleLink}}', 'Đặt lại mật khẩu'));
};
exports.sendForgotPasswordAdminEmail = sendForgotPasswordAdminEmail;
