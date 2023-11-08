import { Request, Response } from 'express'

import { INVOICE_MESSAGES } from '~/constants/messages'
import { GetInvoiceReqParams } from '~/models/requests/Invoice.requests'
import Order from '~/models/schemas/Orders.schema'
import invoiceService from '~/services/invoices.services'

export const getInvoiceController = async (req: Request<GetInvoiceReqParams>, res: Response) => {
    const { order_id } = req.params
    const order = req.order as Order
    const result = await invoiceService.getInvoice(order_id, order)

    return res.json({
        message: INVOICE_MESSAGES.GET_INVOICE_SUCCESS,
        result
    })
}
