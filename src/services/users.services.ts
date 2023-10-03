import { Request } from 'express'
import path from 'path'
import fsPromise from 'fs/promises'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'

import { TokenTypes, UserVerifyStatus } from '~/constants/enums'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { USERS_MESSAGES } from '~/constants/messages'
import {
    RegisterReqBody,
    UpdateAddressReqBody,
    UpdateMeReqBody,
    CreateAddressReqBody
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Address from '~/models/schemas/Address.schema'
import databaseService from './database.services'
import mediaService from './medias.services'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/utils/email'

config()

class UserService {
    private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
        return signToken({
            payload: {
                user_id,
                verify,
                token_type: TokenTypes.AccessToken
            },
            privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN
            }
        })
    }

    private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
        if (exp) {
            return signToken({
                payload: {
                    user_id,
                    verify,
                    token_type: TokenTypes.RefreshToken,
                    exp
                },
                privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
            })
        }

        return signToken({
            payload: {
                user_id,
                verify,
                token_type: TokenTypes.RefreshToken
            },
            privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN
            }
        })
    }

    private signAccessTokenAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
        return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
    }

    private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
        return signToken({
            payload: {
                user_id,
                verify,
                token_type: TokenTypes.EmailVerifyToken
            },
            privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
            options: {
                expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN
            }
        })
    }

    private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
        return signToken({
            payload: {
                user_id,
                verify,
                token_type: TokenTypes.ForgotPasswordToken
            },
            privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
            options: {
                expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_IN
            }
        })
    }

    private decodeRefreshToken(refresh_token: string) {
        return verifyToken({
            token: refresh_token,
            secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
        })
    }

    async checkEmailExist(email: string) {
        const user = await databaseService.users.findOne({ email })

        return Boolean(user)
    }

    async checkUsernameExist(username: string) {
        const user = await databaseService.users.findOne({ username })

        return Boolean(user)
    }

    async register(payload: RegisterReqBody) {
        const user_id = new ObjectId()
        const [email_verify_token, [access_token, refresh_token]] = await Promise.all([
            this.signEmailVerifyToken({
                user_id: user_id.toString(),
                verify: UserVerifyStatus.Unverified
            }),
            this.signAccessTokenAndRefreshToken({
                user_id: user_id.toString(),
                verify: UserVerifyStatus.Unverified
            })
        ])
        const { iat, exp } = await this.decodeRefreshToken(refresh_token)

        await sendVerifyRegisterEmail(payload.email, email_verify_token)
        await Promise.all([
            databaseService.users.insertOne(
                new User({
                    ...payload,
                    _id: user_id,
                    password: hashPassword(payload.password),
                    date_of_birth: new Date(payload.date_of_birth),
                    email_verify_token
                })
            ),
            databaseService.refreshTokens.insertOne(
                new RefreshToken({
                    token: refresh_token,
                    user_id,
                    iat,
                    exp
                })
            )
        ])

        return { access_token, refresh_token }
    }

    async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
        const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({ user_id, verify })
        const { iat, exp } = await this.decodeRefreshToken(refresh_token)

        await databaseService.refreshTokens.insertOne(
            new RefreshToken({
                token: refresh_token,
                user_id: new ObjectId(user_id),
                iat,
                exp
            })
        )

        return { access_token, refresh_token }
    }

    async logout(refresh_token: string) {
        await databaseService.refreshTokens.deleteOne({ token: refresh_token })

        return { message: USERS_MESSAGES.LOGOUT_SUCCESS }
    }

    async verifyEmail(user_id: string) {
        const [[access_token, refresh_token], _] = await Promise.all([
            this.signAccessTokenAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
            databaseService.users.updateOne(
                { _id: new ObjectId(user_id) },
                {
                    $set: {
                        email_verify_token: '',
                        verify: UserVerifyStatus.Verified
                    },
                    $currentDate: {
                        updated_at: true
                    }
                }
            )
        ])
        const { iat, exp } = await this.decodeRefreshToken(refresh_token)

        await databaseService.refreshTokens.insertOne(
            new RefreshToken({
                user_id: new ObjectId(user_id),
                token: refresh_token,
                iat,
                exp
            })
        )

        return { access_token, refresh_token }
    }

    async resendVerifyEmail(user_id: string, email: string) {
        const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })

        await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            {
                $set: {
                    email_verify_token
                },
                $currentDate: {
                    updated_at: true
                }
            }
        )

        await sendVerifyRegisterEmail(email, email_verify_token)

        return { message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS }
    }

    async forgotPassword({ user_id, email, verify }: { user_id: string; email: string; verify: UserVerifyStatus }) {
        const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })

        await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            {
                $set: {
                    forgot_password_token
                },
                $currentDate: {
                    updated_at: true
                }
            }
        )

        await sendForgotPasswordEmail(email, forgot_password_token)

        return { message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
    }

    async resetPassword(user_id: string, password: string) {
        await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            {
                $set: {
                    password: hashPassword(password),
                    forgot_password_token: ''
                },
                $currentDate: {
                    updated_at: true
                }
            }
        )

        return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS }
    }

    async refreshToken({
        user_id,
        verify,
        exp,
        refresh_token
    }: {
        user_id: string
        verify: UserVerifyStatus
        exp: number
        refresh_token: string
    }) {
        const [new_access_token, new_refresh_token, _] = await Promise.all([
            this.signAccessToken({ user_id, verify }),
            this.signRefreshToken({ user_id, verify, exp }),
            databaseService.refreshTokens.deleteOne({ token: refresh_token })
        ])
        const decode_new_refresh_token = await this.decodeRefreshToken(new_refresh_token)

        await databaseService.refreshTokens.insertOne(
            new RefreshToken({
                token: new_refresh_token,
                user_id: new ObjectId(user_id),
                iat: decode_new_refresh_token.iat,
                exp: decode_new_refresh_token.exp
            })
        )

        return {
            access_token: new_access_token,
            refresh_token: new_refresh_token
        }
    }

    async getMe(user_id: string) {
        const user = await databaseService.users.findOne(
            { _id: new ObjectId(user_id) },
            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0
                }
            }
        )

        return user
    }

    async updateAvatar(user_id: string, req: Request) {
        // Xoá avatar cũ
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        const avatar = user && user.avatar

        if (avatar) {
            const avatar_path = path.resolve(UPLOAD_IMAGE_DIR, avatar)

            await fsPromise.unlink(avatar_path)
        }

        // Lưu avatar mới
        const [media] = await mediaService.uploadImage({
            req,
            maxFiles: 1, // 1 file
            maxFileSize: 5 * 1024 * 1024 // 5mb
        })
        const new_avatar = media.url.split('/').slice(-1)[0]

        await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            {
                $set: {
                    avatar: new_avatar
                },
                $currentDate: {
                    updated_at: true
                }
            }
        )

        return media
    }

    async updateMe(user_id: string, payload: UpdateMeReqBody) {
        const user = await databaseService.users.findOneAndUpdate(
            { _id: new ObjectId(user_id) },
            {
                $set: {
                    ...payload,
                    date_of_birth: new Date(payload.date_of_birth as string)
                },
                $currentDate: {
                    updated_at: true
                }
            },
            {
                returnDocument: 'after',
                includeResultMetadata: false,
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0
                }
            }
        )

        return user
    }

    async changePassword(user_id: string, new_password: string) {
        await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            {
                $set: {
                    password: hashPassword(new_password)
                },
                $currentDate: {
                    updated_at: true
                }
            }
        )

        return { message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS }
    }

    async createAddress(user_id: string, payload: CreateAddressReqBody) {
        const result = await databaseService.addresses.insertOne(
            new Address({
                ...payload,
                user_id: new ObjectId(user_id)
            })
        )
        const address = await databaseService.addresses.findOne({ _id: result.insertedId })

        return address
    }

    async getAddress(user_id: string) {
        const addresses = await databaseService.addresses
            .find({
                user_id: new ObjectId(user_id)
            })
            .toArray()

        return addresses
    }

    async updateAddress(address_id: string, payload: UpdateAddressReqBody) {
        const address = await databaseService.addresses.findOneAndUpdate(
            { _id: new ObjectId(address_id) },
            {
                $set: payload,
                $currentDate: {
                    updated_at: true
                }
            },
            {
                returnDocument: 'after',
                includeResultMetadata: false
            }
        )

        return address
    }

    async deleteAddress(address_id: string) {
        await databaseService.addresses.deleteOne({
            _id: new ObjectId(address_id)
        })

        return { message: USERS_MESSAGES.DELETE_ADDRESS_SUCCESS }
    }
}

const userService = new UserService()

export default userService
