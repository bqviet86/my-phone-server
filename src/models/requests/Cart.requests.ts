import { ParamsDictionary } from 'express-serve-static-core'

export interface AddToCartReqBody {
    phone_id: string
    phone_option_id: string
    quantity: number
}

export interface UpdateCartReqParams extends ParamsDictionary {
    cart_id: string
}

export interface UpdateCartReqBody {
    phone_option_id: string
    quantity: number
}

export interface DeleteCartReqParams extends ParamsDictionary {
    cart_id: string
}
