import { ObjectId } from 'mongodb'

import { UserRole, Sex, UserVerifyStatus } from '~/constants/enums'

interface UserType {
    _id?: ObjectId
    name: string
    email: string
    date_of_birth: Date
    sex: Sex
    phone_number: string
    password: string
    email_verify_token?: string
    forgot_password_token?: string
    verify?: UserVerifyStatus
    role?: UserRole
    address?: ObjectId[]
    avatar?: string
    created_at?: Date
    updated_at?: Date
}

export default class User {
    _id?: ObjectId
    name: string
    email: string
    date_of_birth: Date
    sex: Sex
    phone_number: string
    password: string
    email_verify_token: string
    forgot_password_token: string
    verify: UserVerifyStatus
    role: UserRole
    address: ObjectId[]
    avatar: string
    created_at: Date
    updated_at: Date

    constructor(user: UserType) {
        const date = new Date()

        this._id = user._id
        this.name = user.name
        this.email = user.email
        this.date_of_birth = user.date_of_birth
        this.sex = user.sex
        this.phone_number = user.phone_number
        this.password = user.password
        this.email_verify_token = user.email_verify_token || ''
        this.forgot_password_token = user.forgot_password_token || ''
        this.verify = user.verify || UserVerifyStatus.Unverified
        this.role = user.role || UserRole.User
        this.address = user.address || []
        this.avatar = user.avatar || ''
        this.created_at = user.created_at || date
        this.updated_at = user.updated_at || date
    }
}
