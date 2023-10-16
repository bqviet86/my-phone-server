import { checkSchema } from 'express-validator'

import { phoneIdSchema, phoneOptionIdSchema } from './common.middlewares'
import { validate } from '~/utils/validation'
import { CARTS_MESSAGES } from '~/constants/messages'

export const addToCartValidator = validate(
    checkSchema(
        {
            phone_id: {
                notEmpty: {
                    errorMessage: CARTS_MESSAGES.PHONE_ID_IS_REQUIRED
                },
                isString: {
                    errorMessage: CARTS_MESSAGES.PHONE_ID_MUST_BE_A_STRING
                },
                ...phoneIdSchema
            },
            phone_option_id: {
                notEmpty: {
                    errorMessage: CARTS_MESSAGES.PHONE_OPTION_ID_IS_REQUIRED
                },
                isString: {
                    errorMessage: CARTS_MESSAGES.PHONE_OPTION_ID_MUST_BE_A_STRING
                },
                ...phoneOptionIdSchema
            },
            quantity: {
                notEmpty: {
                    errorMessage: CARTS_MESSAGES.QUANTITY_IS_REQUIRED
                },
                isInt: {
                    errorMessage: CARTS_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
                }
            }
        },
        ['body']
    )
)
