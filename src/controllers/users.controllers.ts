import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'

import { UserRole, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import {
    ChangePasswordReqBody,
    ForgotPasswordReqBody,
    LoginReqBody,
    LogoutReqBody,
    RefreshTokenReqBody,
    RegisterReqBody,
    ResetPasswordReqBody,
    TokenPayload,
    UpdateAddressReqBody,
    UpdateMeReqBody,
    VerifyEmailReqBody,
    VerifyForgotPasswordReqBody,
    CreateAddressReqBody,
    UpdateAddressReqParams,
    DeleteAddressReqParams,
    GetAllUsersReqQuery
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

config()

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
    const result = await usersService.register(req.body)

    return res.json({
        message: USERS_MESSAGES.REGISTER_SUCCESS,
        result
    })
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
    const { _id, verify, role } = req.user as User
    const result = await usersService.login({ user_id: (_id as ObjectId).toString(), verify, role })

    return res.json({
        message: USERS_MESSAGES.LOGIN_SUCCESS,
        result
    })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
    const { refresh_token } = req.body
    const result = await usersService.logout(refresh_token)

    return res.json(result)
}

export const verifyEmailController = async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) => {
    const user = req.user as User

    if (user.verify === UserVerifyStatus.Verified) {
        return res.json({
            message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
        })
    }

    const result = await usersService.verifyEmail((user._id as ObjectId).toString())

    return res.json({
        message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
        result
    })
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: USERS_MESSAGES.USER_NOT_FOUND
        })
    }

    if (user.verify === UserVerifyStatus.Verified) {
        return res.json({
            message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
        })
    }

    const result = await usersService.resendVerifyEmail(user_id, user.email)

    return res.json(result)
}

export const forgotPasswordController = async (
    req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
    res: Response
) => {
    const { _id, email, verify, role } = req.user as User
    const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), email, verify, role })

    return res.json(result)
}

export const verifyForgotPasswordController = async (
    req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
    res: Response
) => {
    return res.json({
        message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
    })
}

export const resetPasswordController = async (
    req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
    res: Response
) => {
    const { user_id } = req.decoded_forgot_password_token as TokenPayload
    const { password } = req.body
    const result = await usersService.resetPassword(user_id, password)

    return res.json(result)
}

export const refreshTokenController = async (
    req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
    res: Response
) => {
    const { user_id, verify, role, exp } = req.decoded_refresh_token as TokenPayload
    const { refresh_token } = req.body
    const result = await usersService.refreshToken({ user_id, verify, role, exp, refresh_token })

    return res.json({
        message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
        result
    })
}

export const getMeController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersService.getMe(user_id)

    return res.json({
        message: USERS_MESSAGES.GET_ME_SUCCESS,
        result
    })
}

export const getAllUsersController = async (
    req: Request<ParamsDictionary, any, any, GetAllUsersReqQuery>,
    res: Response
) => {
    const { page, limit, search } = req.query
    const result = await usersService.getAllUsers({
        page: Number(page),
        limit: Number(limit),
        search
    })

    return res.json({
        message: USERS_MESSAGES.GET_ALL_USERS_SUCCESS,
        result
    })
}

export const updateAvatarController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersService.updateAvatar(user_id, req)

    return res.json({
        message: USERS_MESSAGES.UPDATE_AVATAR_SUCCESS,
        result
    })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersService.updateMe(user_id, req.body)

    return res.json({
        message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
        result
    })
}

export const changePasswordController = async (
    req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
    res: Response
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { password } = req.body
    const result = await usersService.changePassword(user_id, password)

    return res.json(result)
}

export const createAddressController = async (
    req: Request<ParamsDictionary, any, CreateAddressReqBody>,
    res: Response
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersService.createAddress(user_id, req.body)

    return res.json({
        message: USERS_MESSAGES.CREATE_ADDRESS_SUCCESS,
        result
    })
}

export const getAddressController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersService.getAddress(user_id)

    return res.json({
        message: USERS_MESSAGES.GET_ADDRESS_SUCCESS,
        result
    })
}

export const updateAddressController = async (
    req: Request<UpdateAddressReqParams, any, UpdateAddressReqBody>,
    res: Response
) => {
    const { address_id } = req.params
    const result = await usersService.updateAddress(address_id, req.body)

    return res.json({
        message: USERS_MESSAGES.UPDATE_ADDRESS_SUCCESS,
        result
    })
}

export const deleteAddressController = async (req: Request<DeleteAddressReqParams>, res: Response) => {
    const { address_id } = req.params
    const result = await usersService.deleteAddress(address_id)

    return res.json(result)
}

export const loginAdminController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
    const { _id, verify, role } = req.user as User

    if (role !== UserRole.Admin) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: USERS_MESSAGES.USER_NOT_ADMIN
        })
    }

    const result = await usersService.login({ user_id: (_id as ObjectId).toString(), verify, role })

    return res.json({
        message: USERS_MESSAGES.LOGIN_SUCCESS,
        result
    })
}

export const logoutAdminController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
    const { role } = req.decoded_refresh_token as TokenPayload
    const { refresh_token } = req.body

    if (role !== UserRole.Admin) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: USERS_MESSAGES.USER_NOT_ADMIN
        })
    }

    const result = await usersService.logout(refresh_token)

    return res.json(result)
}

export const forgotPasswordAdminController = async (
    req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
    res: Response
) => {
    const { _id, email, verify, role } = req.user as User

    if (role !== UserRole.Admin) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: USERS_MESSAGES.USER_NOT_ADMIN
        })
    }

    const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), email, verify, role })

    return res.json(result)
}

export const verifyForgotPasswordAdminController = async (
    req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
    res: Response
) => {
    const { role } = req.decoded_forgot_password_token as TokenPayload

    if (role !== UserRole.Admin) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: USERS_MESSAGES.USER_NOT_ADMIN
        })
    }

    return res.json({
        message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
    })
}

export const resetPasswordAdminController = async (
    req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
    res: Response
) => {
    const { user_id, role } = req.decoded_forgot_password_token as TokenPayload
    const { password } = req.body

    if (role !== UserRole.Admin) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: USERS_MESSAGES.USER_NOT_ADMIN
        })
    }

    const result = await usersService.resetPassword(user_id, password)

    return res.json(result)
}
