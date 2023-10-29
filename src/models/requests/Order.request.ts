import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface CreateOrderReqParams extends ParamsDictionary {
    payment_method: string
}

export interface CreateOrderReqBody {
    carts: string[]
    address: string
    content: string
}

export interface GetAllOrderReqQuery extends Query {
    order_status: string
}
