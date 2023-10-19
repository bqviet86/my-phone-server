import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { pick } from 'lodash'

import HTTP_STATUS from '~/constants/httpStatus'
import { PHONES_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import Phone from '~/models/schemas/Phone.schema'
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
                isNumeric: true,
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
                isNumeric: true,
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
