import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import HTTP_STATUS from '~/constants/httpStatus'
import { BRANDS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
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

export const deleteBrandValidator = validate(
    checkSchema(
        {
            brand_id: {
                trim: true,
                custom: {
                    options: async (value: string) => {
                        if (!ObjectId.isValid(value)) {
                            throw new ErrorWithStatus({
                                message: BRANDS_MESSAGES.BRAND_ID_IS_INVALID,
                                status: HTTP_STATUS.BAD_REQUEST
                            })
                        }

                        const brand = await databaseService.brands.findOne({
                            _id: new ObjectId(value)
                        })

                        if (brand === null) {
                            throw new ErrorWithStatus({
                                message: BRANDS_MESSAGES.BRAND_IS_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        return true
                    }
                }
            }
        },
        ['params']
    )
)
