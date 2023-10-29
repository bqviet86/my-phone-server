import { ParamsDictionary } from 'express-serve-static-core'

export interface CreateOrderReqParams extends ParamsDictionary {
    payment_method: string
}

export interface CreateOrderReqBody {
    carts: string[]
    address: string
    content: string
}
