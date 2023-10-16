import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import HTTP_STATUS from '~/constants/httpStatus'
import { CARTS_MESSAGES } from '~/constants/messages'
import { phoneIdSchema, phoneOptionIdSchema } from './common.middlewares'
import Phone from '~/models/schemas/Phone.schema'
import PhoneOption from '~/models/schemas/PhoneOption.schema'
import { ErrorWithStatus } from '~/models/Errors'
import { validate } from '~/utils/validation'

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

export const isPhoneOptionIdMatched = (req: Request, res: Response, next: NextFunction) => {
    const phone = req.phone as Phone
    const { phone_option_id } = req.body
    let phone_option_matched: PhoneOption | null = null

    for (const option of phone.options as unknown as PhoneOption[]) {
        if ((option._id as ObjectId).equals(phone_option_id)) {
            phone_option_matched = option
            break
        }
    }

    if (phone_option_matched === null) {
        return next(
            new ErrorWithStatus({
                message: CARTS_MESSAGES.INVALID_PHONE_OPTION_ID,
                status: HTTP_STATUS.BAD_REQUEST
            })
        )
    }

    next()
}
