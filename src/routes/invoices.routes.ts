import { Router } from 'express'
import { getInvoiceController } from '~/controllers/invoices.controllers'

import { getInvoiceValidator } from '~/middlewares/invoices.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const invoicesRouter = Router()

/**
 * Description: Get invoice
 * Path: /:order_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: GetInvoiceReqParams
 */
invoicesRouter.get('/:order_id', accessTokenValidator, getInvoiceValidator, wrapRequestHandler(getInvoiceController))

export default invoicesRouter
