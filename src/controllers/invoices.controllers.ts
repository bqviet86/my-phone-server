import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { INVOICE_MESSAGES } from '~/constants/messages'
import { CreateInvoiceReqBody, DeleteInvoiceReqParams, GetInvoiceReqParams } from '~/models/requests/Invoice.requests'
import Order from '~/models/schemas/Orders.schema'
import invoiceService from '~/services/invoices.services'

export const createInvoiceController = async (
    req: Request<ParamsDictionary, any, CreateInvoiceReqBody>,
    res: Response
) => {
    const { order_id } = req.body
    const result = await invoiceService.createInvoice(order_id)

    return res.json({
        message: INVOICE_MESSAGES.CREATE_INVOICE_SUCCESS,
        result
    })
}

export const getInvoiceController = async (req: Request<GetInvoiceReqParams>, res: Response) => {
    const { order_id } = req.params
    const order = req.order as Order
    const result = await invoiceService.getInvoice(order_id, order)

    return res.json({
        message: INVOICE_MESSAGES.GET_INVOICE_SUCCESS,
        result
    })
}

export const deleteInvoiceController = async (req: Request<DeleteInvoiceReqParams>, res: Response) => {
    const { order_id } = req.params
    const result = await invoiceService.deleteInvoice(order_id)

    return res.json(result)
}
