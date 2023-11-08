import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { pick } from 'lodash'

import { UserRole } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDERS_MESSAGES, PHONES_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import Phone from '~/models/schemas/Phone.schema'
import Order from '~/models/schemas/Orders.schema'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

type FilterKeys<T> = Array<keyof T>

// Middlewares
export const filterMiddleware =
    <T>(filterKeys: FilterKeys<T>) =>
    (req: Request, res: Response, next: NextFunction) => {
        req.body = pick(req.body, filterKeys)
        next()
    }

// Schemas
export const phoneOptionIdSchema: ParamSchema = {
    trim: true,
    custom: {
        options: async (value: string, { req }) => {
            if (!ObjectId.isValid(value)) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.INVALID_PHONE_OPTION_ID,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            const phone_option = await databaseService.phoneOptions.findOne({
                _id: new ObjectId(value)
            })

            if (phone_option === null) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.PHONE_OPTION_NOT_FOUND,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }

            ;(req as Request).phone_option = phone_option

            return true
        }
    }
}

export const phoneIdSchema: ParamSchema = {
    trim: true,
    custom: {
        options: async (value: string, { req }) => {
            if (!ObjectId.isValid(value)) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.INVALID_PHONE_ID,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            const [phone] = await databaseService.phones
                .aggregate<Phone>([
                    {
                        $match: {
                            _id: new ObjectId(value)
                        }
                    },
                    {
                        $lookup: {
                            from: 'brands',
                            localField: 'brand',
                            foreignField: '_id',
                            as: 'brand'
                        }
                    },
                    {
                        $unwind: '$brand'
                    },
                    {
                        $lookup: {
                            from: 'phone_options',
                            localField: 'options',
                            foreignField: '_id',
                            as: 'options'
                        }
                    }
                ])
                .toArray()

            if (phone === undefined) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.PHONE_NOT_FOUND,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }

            ;(req as Request).phone = phone

            return true
        }
    }
}

export const paginationValidator = validate(
    checkSchema(
        {
            page: {
                notEmpty: {
                    errorMessage: 'Page không được để trống'
                },
                isNumeric: {
                    errorMessage: 'Page phải là một số'
                },
                custom: {
                    options: async (value: number) => {
                        const num = Number(value)

                        if (num < 1) {
                            throw new Error('page >= 1')
                        }

                        return true
                    }
                }
            },
            limit: {
                notEmpty: {
                    errorMessage: 'Limit không được để trống'
                },
                isNumeric: {
                    errorMessage: 'Limit phải là một số'
                },
                custom: {
                    options: async (value: number) => {
                        const num = Number(value)

                        if (num > 100 || num < 1) {
                            throw new Error('1 <= limit <= 100')
                        }

                        return true
                    }
                }
            }
        },
        ['query']
    )
)

export const orderIdSchema: ParamSchema = {
    trim: true,
    custom: {
        options: async (value: string, { req }) => {
            if (!ObjectId.isValid(value)) {
                throw new ErrorWithStatus({
                    message: ORDERS_MESSAGES.INVALID_ORDER_ID,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            const { user_id, role } = (req as Request).decoded_authorization as TokenPayload
            const [order] = await databaseService.orders
                .aggregate<Order>([
                    {
                        $match: {
                            _id: new ObjectId(value),
                            ...(role === UserRole.User && { user_id: new ObjectId(user_id) })
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: {
                            path: '$user'
                        }
                    },
                    {
                        $lookup: {
                            from: 'addresses',
                            localField: 'address',
                            foreignField: '_id',
                            as: 'address'
                        }
                    },
                    {
                        $unwind: {
                            path: '$address'
                        }
                    },
                    {
                        $lookup: {
                            from: 'carts',
                            localField: 'carts',
                            foreignField: '_id',
                            as: 'carts'
                        }
                    },
                    {
                        $unwind: {
                            path: '$carts'
                        }
                    },
                    {
                        $lookup: {
                            from: 'phones',
                            localField: 'carts.phone_id',
                            foreignField: '_id',
                            as: 'carts.phone'
                        }
                    },
                    {
                        $unwind: {
                            path: '$carts.phone'
                        }
                    },
                    {
                        $lookup: {
                            from: 'brands',
                            localField: 'carts.phone.brand',
                            foreignField: '_id',
                            as: 'carts.phone.brand'
                        }
                    },
                    {
                        $unwind: {
                            path: '$carts.phone.brand'
                        }
                    },
                    {
                        $lookup: {
                            from: 'phone_options',
                            localField: 'carts.phone_option_id',
                            foreignField: '_id',
                            as: 'carts.phone_option'
                        }
                    },
                    {
                        $unwind: {
                            path: '$carts.phone_option'
                        }
                    },
                    {
                        $group: {
                            _id: '$_id',
                            user: {
                                $first: '$user'
                            },
                            address: {
                                $first: '$address'
                            },
                            carts: {
                                $push: '$carts'
                            },
                            content: {
                                $first: '$content'
                            },
                            order_status: {
                                $first: '$order_status'
                            },
                            created_at: {
                                $first: '$created_at'
                            },
                            updated_at: {
                                $first: '$updated_at'
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'payments',
                            localField: '_id',
                            foreignField: 'order_id',
                            as: 'payment'
                        }
                    },
                    {
                        $unwind: {
                            path: '$payment'
                        }
                    },
                    {
                        $project: {
                            user: {
                                password: 0,
                                email_verify_token: 0,
                                forgot_password_token: 0
                            },
                            carts: {
                                user_id: 0,
                                phone_id: 0,
                                phone_option_id: 0,
                                phone: {
                                    price: 0,
                                    price_before_discount: 0,
                                    image: 0,
                                    options: 0,
                                    description: 0,
                                    screen_type: 0,
                                    resolution: 0,
                                    operating_system: 0,
                                    memory: 0,
                                    chip: 0,
                                    battery: 0,
                                    rear_camera: 0,
                                    front_camera: 0,
                                    wifi: 0,
                                    jack_phone: 0,
                                    size: 0,
                                    weight: 0
                                }
                            }
                        }
                    }
                ])
                .toArray()

            if (order === undefined) {
                throw new ErrorWithStatus({
                    message: ORDERS_MESSAGES.ORDER_NOT_FOUND,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }

            ;(req as Request).order = order

            return true
        }
    }
}
