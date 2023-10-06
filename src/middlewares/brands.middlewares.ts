import { checkSchema } from 'express-validator'

import { BRANDS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const createBrandValidator = validate(
    checkSchema(
        {
            name: {
                notEmpty: {
                    errorMessage: BRANDS_MESSAGES.NAME_IS_REQUIRED
                },
                isString: {
                    errorMessage: BRANDS_MESSAGES.NAME_MUST_BE_A_STRING
                },
                trim: true,
                isLength: {
                    options: {
                        min: 1,
                        max: 20
                    },
                    errorMessage: BRANDS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_20
                }
            }
        },
        ['body']
    )
)
