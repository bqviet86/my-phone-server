import { ParamsDictionary } from 'express-serve-static-core'

export interface GetInvoiceReqParams extends ParamsDictionary {
    order_id: string
}
