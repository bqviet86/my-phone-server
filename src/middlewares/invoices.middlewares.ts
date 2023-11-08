import { checkSchema } from 'express-validator'

import { orderIdSchema } from './common.middlewares'
import { validate } from '~/utils/validation'

export const getInvoiceValidator = validate(
    checkSchema(
        {
            order_id: orderIdSchema
        },
        ['params']
    )
)
