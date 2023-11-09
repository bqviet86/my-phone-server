import { checkSchema } from 'express-validator'

import { orderIdSchema } from './common.middlewares'
import { validate } from '~/utils/validation'

export const createInvoiceValidator = validate(
    checkSchema(
        {
            order_id: orderIdSchema
        },
        ['body']
    )
)

export const getInvoiceValidator = validate(
    checkSchema(
        {
            order_id: orderIdSchema
        },
        ['params']
    )
)

export const deleteInvoiceValidator = validate(
    checkSchema(
        {
            order_id: orderIdSchema
        },
        ['params']
    )
)
