import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { CartStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { CARTS_MESSAGES } from '~/constants/messages'
import { phoneIdSchema, phoneOptionIdSchema } from './common.middlewares'
import Phone from '~/models/schemas/Phone.schema'
import PhoneOption from '~/models/schemas/PhoneOption.schema'
import Cart from '~/models/schemas/Cart.schema'
import { TokenPayload } from '~/models/requests/User.requests'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

const newPhoneOptionIdSchema: ParamSchema = {
    notEmpty: {
        errorMessage: CARTS_MESSAGES.PHONE_OPTION_ID_IS_REQUIRED
    },
    isString: {
        errorMessage: CARTS_MESSAGES.PHONE_OPTION_ID_MUST_BE_A_STRING
    },
    ...phoneOptionIdSchema
}

const quantitySchema: ParamSchema = {
    notEmpty: {
        errorMessage: CARTS_MESSAGES.QUANTITY_IS_REQUIRED
    },
    isInt: {
        errorMessage: CARTS_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
    }
}

const cartIdSchema: ParamSchema = {
    notEmpty: {
        errorMessage: CARTS_MESSAGES.CART_ID_IS_REQUIRED
    },
    isString: {
        errorMessage: CARTS_MESSAGES.CART_ID_MUST_BE_A_STRING
    },
    custom: {
        options: async (value: string, { req }) => {
            const { user_id } = (req as Request).decoded_authorization as TokenPayload

            if (!ObjectId.isValid(value)) {
                throw new ErrorWithStatus({
                    message: CARTS_MESSAGES.INVALID_CART_ID,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            const [cart] = await databaseService.carts
                .aggregate<Cart>([
                    {
                        $match: {
                            _id: new ObjectId(value),
                            user_id: new ObjectId(user_id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'phones',
                            localField: 'phone_id',
                            foreignField: '_id',
                            as: 'phone'
                        }
                    },
                    {
                        $unwind: '$phone'
                    },
                    {
                        $lookup: {
                            from: 'phone_options',
                            localField: 'phone.options',
                            foreignField: '_id',
                            as: 'phone.options'
                        }
                    }
                ])
                .toArray()

            if (cart === undefined) {
                throw new ErrorWithStatus({
                    message: CARTS_MESSAGES.CART_NOT_FOUND,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }

            ;(req as Request).phone = (cart as any).phone

            return true
        }
    }
}

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
            phone_option_id: newPhoneOptionIdSchema,
            quantity: quantitySchema
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

export const getCartValidator = validate(
    checkSchema(
        {
            carts: {
                optional: true,
                custom: {
                    options: async (value: string, { req }) => {
                        const cartValues = value ? value.split('|') : []

                        if (cartValues.length > 0 && !cartValues.every((item) => ObjectId.isValid(item))) {
                            throw new ErrorWithStatus({
                                message: CARTS_MESSAGES.INVALID_CART_ID,
                                status: HTTP_STATUS.BAD_REQUEST
                            })
                        }

                        const { user_id } = (req as Request).decoded_authorization as TokenPayload
                        const carts = await databaseService.carts
                            .aggregate<Cart>([
                                {
                                    $match: {
                                        ...(cartValues.length > 0 && {
                                            _id: {
                                                $in: cartValues.map((item) => new ObjectId(item))
                                            }
                                        }),
                                        user_id: new ObjectId(user_id),
                                        cart_status: CartStatus.Pending
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'phones',
                                        localField: 'phone_id',
                                        foreignField: '_id',
                                        as: 'phone'
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'phone_options',
                                        localField: 'phone_option_id',
                                        foreignField: '_id',
                                        as: 'phone_option'
                                    }
                                },
                                {
                                    $unwind: '$phone'
                                },
                                {
                                    $unwind: '$phone_option'
                                },
                                {
                                    $lookup: {
                                        from: 'brands',
                                        localField: 'phone.brand',
                                        foreignField: '_id',
                                        as: 'phone.brand'
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'phone_options',
                                        localField: 'phone.options',
                                        foreignField: '_id',
                                        as: 'phone.options'
                                    }
                                },
                                {
                                    $unwind: '$phone.brand'
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        phone: {
                                            _id: 1,
                                            name: 1,
                                            brand: 1,
                                            options: 1
                                        },
                                        phone_option: {
                                            _id: 1,
                                            color: 1,
                                            capacity: 1,
                                            price: 1,
                                            price_before_discount: 1,
                                            images: 1
                                        },
                                        quantity: 1,
                                        total_price: 1,
                                        created_at: 1,
                                        updated_at: 1
                                    }
                                },
                                {
                                    $sort: {
                                        updated_at: -1
                                    }
                                }
                            ])
                            .toArray()

                        if (cartValues.length > 0 && carts.length !== cartValues.length) {
                            throw new ErrorWithStatus({
                                message: CARTS_MESSAGES.CART_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        ;(req as Request).carts = carts

                        return true
                    }
                }
            }
        },
        ['query']
    )
)

export const updateCartValidator = validate(
    checkSchema(
        {
            cart_id: cartIdSchema,
            phone_option_id: newPhoneOptionIdSchema,
            quantity: quantitySchema
        },
        ['params', 'body']
    )
)

export const deleteCartValidator = validate(
    checkSchema(
        {
            cart_id: cartIdSchema
        },
        ['params']
    )
)
