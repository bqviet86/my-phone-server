import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { CartStatus, OrderStatus, PaymentMethod, UserRole } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDERS_MESSAGES } from '~/constants/messages'
import { orderIdSchema } from './common.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const paymentMethodValues = numberEnumToArray(PaymentMethod)

const orderStatusValues = numberEnumToArray(OrderStatus)

const paymentMethodSchema: ParamSchema = {
    isIn: {
        options: [paymentMethodValues],
        errorMessage: ORDERS_MESSAGES.INVALID_PAYMENT_METHOD
    }
}

const cartsCustomFunction = async (
    value: string[],
    { req }: { req: Request },
    cart_status: CartStatus = CartStatus.Pending
) => {
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
            cart_status
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

const cartsSchema: ParamSchema = {
    isArray: true,
    custom: {
        options: async (value: string[], { req }) => {
            return cartsCustomFunction(value, { req: req as Request })
        }
    }
}

const addressCustomFunction = async (value: string, { req }: { req: Request }, optional: boolean = false) => {
    if (optional && !value) {
        return true
    }

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

    ;(req as Request).delivery_address = {
        name: address.name,
        email: address.email,
        phone_number: address.phone_number,
        specific_address: address.specific_address
    }
    ;(req as Request).address = address

    return true
}

const addressSchema: ParamSchema = {
    trim: true,
    custom: {
        options: async (value: string, { req }) => {
            return addressCustomFunction(value, { req: req as Request })
        }
    }
}

const contentSchema: ParamSchema = {
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

export const createOrderValidator = validate(
    checkSchema(
        {
            payment_method: paymentMethodSchema,
            carts: cartsSchema,
            address: addressSchema,
            content: contentSchema
        },
        ['params', 'body']
    )
)

export const getOrderValidator = validate(
    checkSchema(
        {
            order_id: orderIdSchema
        },
        ['params']
    )
)

export const getAllOrdersValidator = validate(
    checkSchema(
        {
            order_status: {
                optional: true,
                custom: {
                    options: async (value: string) => {
                        const orderStatus = Number(value)

                        if (value !== '' && !orderStatusValues.includes(orderStatus)) {
                            throw new ErrorWithStatus({
                                message: ORDERS_MESSAGES.INVALID_ORDER_STATUS,
                                status: HTTP_STATUS.BAD_REQUEST
                            })
                        }

                        return true
                    }
                }
            }
        },
        ['query']
    )
)

export const updateOrderValidator = validate(
    checkSchema(
        {
            order_id: orderIdSchema,
            payment_method: paymentMethodSchema,
            carts: {
                ...cartsSchema,
                custom: {
                    options: async (value: string[], { req }) => {
                        return cartsCustomFunction(value, { req: req as Request }, CartStatus.Ordered)
                    }
                }
            },
            address: addressSchema,
            content: contentSchema
        },
        ['params', 'body']
    )
)

export const isAllowedToUpdateOrder = (req: Request, res: Response, next: NextFunction) => {
    const { user_id, role } = req.decoded_authorization as TokenPayload
    const order = req.order as any

    if (role === UserRole.Admin) {
        return next()
    }

    if (
        (role === UserRole.User && user_id !== order.user._id.toString()) ||
        ![OrderStatus.PendingPayment, OrderStatus.PendingConfirmation].includes(order.order_status) ||
        (order.payment.payment_method === PaymentMethod.CreditCard &&
            order.order_status === OrderStatus.PendingConfirmation)
    ) {
        throw new ErrorWithStatus({
            message: ORDERS_MESSAGES.NOT_ALLOWED_TO_UPDATE_ORDER,
            status: HTTP_STATUS.FORBIDDEN
        })
    }

    next()
}

export const confirmPaymentValidator = validate(
    checkSchema(
        {
            order_id: orderIdSchema,
            payment_method: paymentMethodSchema,
            carts: {
                ...cartsSchema,
                custom: {
                    options: async (value: string[], { req }) => {
                        return cartsCustomFunction(value, { req: req as Request }, CartStatus.Ordered)
                    }
                }
            },
            address: {
                ...addressSchema,
                custom: {
                    options: async (value: string, { req }) => {
                        return addressCustomFunction(value, { req: req as Request }, true)
                    }
                }
            },
            content: contentSchema
        },
        ['params', 'body']
    )
)

export const updateOrderStatusValidator = validate(
    checkSchema(
        {
            order_id: orderIdSchema,
            order_status: {
                isIn: {
                    options: [orderStatusValues],
                    errorMessage: ORDERS_MESSAGES.INVALID_ORDER_STATUS
                }
            }
        },
        ['params', 'body']
    )
)
