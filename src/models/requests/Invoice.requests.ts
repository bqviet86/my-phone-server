import { ParamsDictionary } from 'express-serve-static-core'

export interface CreateInvoiceReqBody {
    order_id: string
}

export interface GetInvoiceReqParams extends ParamsDictionary {
    order_id: string
}

export interface DeleteInvoiceReqParams extends ParamsDictionary {
    order_id: string
}
