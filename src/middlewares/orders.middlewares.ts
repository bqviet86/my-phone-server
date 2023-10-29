import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { CartStatus, PaymentMethod } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const paymentMethodValues = numberEnumToArray(PaymentMethod)

export const createOrderValidator = validate(
    checkSchema(
        {
            payment_method: {
                isIn: {
                    options: [paymentMethodValues],
                    errorMessage: ORDERS_MESSAGES.INVALID_PAYMENT_METHOD
                }
            },
            carts: {
                isArray: true,
                custom: {
                    options: async (value: string[], { req }) => {
                        if (value.length === 0) {
                            throw new ErrorWithStatus({
                                message: ORDERS_MESSAGES.CARTS_IS_EMPTY,
                                status: HTTP_STATUS.BAD_REQUEST
                            })
                        }

                        if (!value.every((item) => typeof item === 'string' && ObjectId.isValid(item))) {
                            throw new ErrorWithStatus({
                                message: ORDERS_MESSAGES.INVALID_CARTS_ID,
                                status: HTTP_STATUS.BAD_REQUEST
                            })
                        }

                        const { user_id } = (req as Request).decoded_authorization as TokenPayload
                        const carts = await databaseService.carts
                            .find({
                                _id: {
                                    $in: value.map((item) => new ObjectId(item))
                                },
                                user_id: new ObjectId(user_id),
                                cart_status: CartStatus.Pending
                            })
                            .toArray()

                        if (carts.length !== value.length) {
                            throw new ErrorWithStatus({
                                message: ORDERS_MESSAGES.HAVE_CART_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        ;(req as Request).carts = carts

                        return true
                    }
                }
            },
            address: {
                trim: true,
                custom: {
                    options: async (value: string, { req }) => {
                        if (!ObjectId.isValid(value)) {
                            throw new ErrorWithStatus({
                                message: ORDERS_MESSAGES.INVALID_ADDRESS_ID,
                                status: HTTP_STATUS.BAD_REQUEST
                            })
                        }

                        const { user_id } = (req as Request).decoded_authorization as TokenPayload
                        const address = await databaseService.addresses.findOne({
                            _id: new ObjectId(value),
                            user_id: new ObjectId(user_id)
                        })

                        if (address === null) {
                            throw new ErrorWithStatus({
                                message: ORDERS_MESSAGES.ADDRESS_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        return true
                    }
                }
            },
            content: {
                optional: true,
                isString: {
                    errorMessage: ORDERS_MESSAGES.CONTENT_MUST_BE_A_STRING
                },
                trim: true,
                isLength: {
                    options: {
                        min: 0,
                        max: 500
                    },
                    errorMessage: ORDERS_MESSAGES.CONTENT_MUST_BE_FROM_0_TO_500_CHARACTERS
                }
            }
        },
        ['params', 'body']
    )
)
