import { Router } from 'express'

import {
    createInvoiceController,
    deleteInvoiceController,
    getInvoiceController
} from '~/controllers/invoices.controllers'
import { createInvoiceValidator, deleteInvoiceValidator, getInvoiceValidator } from '~/middlewares/invoices.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const invoicesRouter = Router()

/**
 * Description: Create invoice
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateInvoiceReqBody
 */
invoicesRouter.post('/', accessTokenValidator, createInvoiceValidator, wrapRequestHandler(createInvoiceController))

/**
 * Description: Get invoice
 * Path: /:order_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: GetInvoiceReqParams
 */
invoicesRouter.get('/:order_id', accessTokenValidator, getInvoiceValidator, wrapRequestHandler(getInvoiceController))

/**
 * Description: Delete invoice
 * Path: /:order_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: DeleteInvoiceReqParams
 */
invoicesRouter.delete(
    '/:order_id',
    accessTokenValidator,
    deleteInvoiceValidator,
    wrapRequestHandler(deleteInvoiceController)
)

export default invoicesRouter
