import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'

import { TokenTypes, Sex, UserVerifyStatus, UserRole } from '~/constants/enums'

export interface RegisterReqBody {
    name: string
    email: string
    password: string
    confirm_password: string
    date_of_birth: string
    sex: Sex
    phone_number: string
}

export interface LoginReqBody {
    email: string
    password: string
}

export interface LogoutReqBody {
    refresh_token: string
}

export interface TokenPayload extends JwtPayload {
    user_id: string
    verify: UserVerifyStatus
    role: UserRole
    token_type: TokenTypes
    iat: number
    exp: number
}

export interface VerifyEmailReqBody {
    email_verify_token: string
}

export interface ForgotPasswordReqBody {
    email: string
}

export interface VerifyForgotPasswordReqBody {
    forgot_password_token: string
}

export interface ResetPasswordReqBody {
    forgot_password_token: string
    password: string
    confirm_password: string
}

export interface RefreshTokenReqBody {
    refresh_token: string
}

export interface UpdateMeReqBody {
    name?: string
    date_of_birth?: string
    sex?: Sex
    phone_number?: string
}

export interface ChangePasswordReqBody {
    old_password: string
    password: string
    confirm_password: string
}

export interface CreateAddressReqBody {
    name: string
    phone_number: string
    email: string
    province: string
    district: string
    ward: string
    specific_address: string
}

export interface UpdateAddressReqParams extends ParamsDictionary {
    address_id: string
}

export interface UpdateAddressReqBody {
    name?: string
    phone_number?: string
    email?: string
    province?: string
    district?: string
    ward?: string
    specific_address?: string
}

export interface DeleteAddressReqParams extends ParamsDictionary {
    address_id: string
}
