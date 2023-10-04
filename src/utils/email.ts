/* eslint-disable no-undef */
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'

config()

// Create SES service object.
const sesClient = new SESClient({
    region: process.env.AWS_REGION as string,
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
    }
})

const emailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf-8')

const createSendEmailCommand = ({
    fromAddress,
    toAddresses,
    ccAddresses = [],
    body,
    subject,
    replyToAddresses = []
}: {
    fromAddress: string
    toAddresses: string | string[]
    ccAddresses?: string | string[]
    body: string
    subject: string
    replyToAddresses?: string | string[]
}) => {
    return new SendEmailCommand({
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
    })
}

export const sendVerifyEmail = (toAddress: string, subject: string, body: string) => {
    const sendEmailCommand = createSendEmailCommand({
        fromAddress: process.env.AWS_SES_FROM_ADDRESS as string,
        toAddresses: toAddress,
        body,
        subject
    })

    return sesClient.send(sendEmailCommand)
}

export const sendVerifyRegisterEmail = (
    toAddress: string,
    email_verify_token: string,
    template: string = emailTemplate
) => {
    return sendVerifyEmail(
        toAddress,
        'Xác thực tài khoản MyPhone',
        template
            .replace('{{title}}', 'Xác thực tài khoản của bạn')
            .replace('{{content-1}}', 'Cảm ơn bạn đã đăng ký tài khoản trên Myphone!')
            .replace('{{content-2}}', 'Vui lòng nhấn vào nút bên dưới để xác thực tài khoản của bạn')
            .replace('{{link}}', `${process.env.CLIENT_URL}/email-verifications?token=${email_verify_token}`)
            .replace('{{titleLink}}', 'Xác thực')
    )
}

export const sendForgotPasswordEmail = (
    toAddress: string,
    forgot_password_token: string,
    template: string = emailTemplate
) => {
    return sendVerifyEmail(
        toAddress,
        'Xác nhận đặt lại mật khẩu MyPhone',
        template
            .replace('{{title}}', 'Đặt lại mật khẩu của bạn')
            .replace('{{content-1}}', 'Bạn đã yêu cầu đặt lại mật khẩu trên Myphone?')
            .replace('{{content-2}}', 'Nếu là bạn, vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu')
            .replace('{{link}}', `${process.env.CLIENT_URL}/forgot-password?token=${forgot_password_token}`)
            .replace('{{titleLink}}', 'Đặt lại mật khẩu')
    )
}

export const sendForgotPasswordAdminEmail = (
    toAddress: string,
    forgot_password_token: string,
    template: string = emailTemplate
) => {
    return sendVerifyEmail(
        toAddress,
        'Xác nhận đặt lại mật khẩu admin của MyPhone',
        template
            .replace('{{title}}', 'Đặt lại mật khẩu admin của bạn')
            .replace('{{content-1}}', 'Bạn đã yêu cầu đặt lại mật khẩu admin trên Myphone?')
            .replace('{{content-2}}', 'Nếu là bạn, vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu')
            .replace('{{link}}', `${process.env.CLIENT_URL}/forgot-password?admin=true&token=${forgot_password_token}`)
            .replace('{{titleLink}}', 'Đặt lại mật khẩu')
    )
}
