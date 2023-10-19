import { Request } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import HTTP_STATUS from '~/constants/httpStatus'
import { PHONES_MESSAGES } from '~/constants/messages'
import { phoneIdSchema, phoneOptionIdSchema } from './common.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

const colorSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.COLOR_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.COLOR_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 20
        },
        errorMessage: PHONES_MESSAGES.COLOR_LENGTH_MUST_BE_FROM_1_TO_20
    }
}

const capacitySchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.CAPACITY_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.CAPACITY_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 20
        },
        errorMessage: PHONES_MESSAGES.CAPACITY_LENGTH_MUST_BE_FROM_1_TO_20
    }
}

const priceSchema: ParamSchema = {
    isInt: {
        errorMessage: PHONES_MESSAGES.PRICE_MUST_BE_A_NUMBER
    }
}

const priceBeforeDiscountSchema: ParamSchema = {
    isInt: {
        errorMessage: PHONES_MESSAGES.PRICE_BEFORE_DISCOUNT_MUST_BE_A_NUMBER
    }
}

const quantitySchema: ParamSchema = {
    isInt: {
        errorMessage: PHONES_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
    }
}

const imagesSchema: ParamSchema = {
    isArray: true,
    custom: {
        options: (value: string[]) => {
            if (value.length === 0) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.NO_IMAGE_PROVIDED,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            if (!value.every((item) => typeof item === 'string')) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.IMAGES_MUST_BE_AN_ARRAY_OF_STRING,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            return true
        }
    },
    errorMessage: PHONES_MESSAGES.IMAGES_MUST_BE_AN_ARRAY_OF_STRING
}

const nameSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.NAME_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.NAME_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const imageSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.NO_IMAGE_PROVIDED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.IMAGE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 25
        },
        errorMessage: PHONES_MESSAGES.IMAGE_NOT_FOUND
    }
}

const optionsSchema: ParamSchema = {
    isArray: true,
    custom: {
        options: async (value: string[], { req }) => {
            if (value.length === 0) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.MUST_PROVIDE_AT_LEAST_ONE_OPTION,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            if (!value.every((item) => typeof item === 'string' && ObjectId.isValid(item))) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.INVALID_PHONE_OPTION_ID,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            const phone_options = await databaseService.phoneOptions
                .find({
                    _id: {
                        $in: value.map((item) => new ObjectId(item))
                    }
                })
                .toArray()

            if (phone_options.length !== value.length) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.HAVE_PHONE_OPTION_NOT_FOUND,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }

            ;(req as Request).phone_options = phone_options

            return true
        }
    }
}

const descriptionSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.DESCRIPTION_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
    },
    trim: true
}

const brandSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.BRAND_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.BRAND_MUST_BE_A_STRING
    },
    trim: true,
    custom: {
        options: async (value: string, { req }) => {
            if (!ObjectId.isValid(value)) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.INVALID_BRAND_ID,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            const brand = await databaseService.brands.findOne({
                _id: new ObjectId(value)
            })

            if (brand === null) {
                throw new ErrorWithStatus({
                    message: PHONES_MESSAGES.BRAND_NOT_FOUND,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            ;(req as Request).brand = brand

            return true
        }
    }
}

const screenTypeSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.SCREEN_TYPE_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.SCREEN_TYPE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.SCREEN_TYPE_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const resolutionSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.RESOLUTION_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.RESOLUTION_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.RESOLUTION_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const operatingSystemSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.OPERATING_SYSTEM_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.OPERATING_SYSTEM_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.OPERATING_SYSTEM_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const memorySchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.MEMORY_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.MEMORY_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.MEMORY_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const chipSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.CHIP_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.CHIP_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.CHIP_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const batterySchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.BATTERY_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.BATTERY_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.BATTERY_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const rearCameraSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.REAR_CAMERA_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.REAR_CAMERA_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.REAR_CAMERA_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const frontCameraSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.FRONT_CAMERA_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.FRONT_CAMERA_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.FRONT_CAMERA_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const wifiSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.WIFI_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.WIFI_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.WIFI_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const jackPhoneSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.JACK_PHONE_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.JACK_PHONE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.JACK_PHONE_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const sizeSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.SIZE_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.SIZE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.SIZE_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const weightSchema: ParamSchema = {
    notEmpty: {
        errorMessage: PHONES_MESSAGES.WEIGHT_IS_REQUIRED
    },
    isString: {
        errorMessage: PHONES_MESSAGES.WEIGHT_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: PHONES_MESSAGES.WEIGHT_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

export const createPhoneOptionValidator = validate(
    checkSchema(
        {
            color: colorSchema,
            capacity: capacitySchema,
            price: priceSchema,
            price_before_discount: priceBeforeDiscountSchema,
            quantity: quantitySchema,
            images: imagesSchema
        },
        ['body']
    )
)

export const updatePhoneOptionValidator = validate(
    checkSchema(
        {
            phone_option_id: phoneOptionIdSchema,
            color: {
                ...colorSchema,
                optional: true,
                notEmpty: false
            },
            capacity: {
                ...capacitySchema,
                optional: true,
                notEmpty: false
            },
            price: {
                ...priceSchema,
                optional: true
            },
            price_before_discount: {
                ...priceBeforeDiscountSchema,
                optional: true
            },
            quantity: {
                ...quantitySchema,
                optional: true
            },
            images: {
                ...imagesSchema,
                optional: true
            }
        },
        ['params', 'body']
    )
)

export const deletePhoneOptionValidator = validate(
    checkSchema(
        {
            phone_option_id: phoneOptionIdSchema
        },
        ['params']
    )
)

export const createPhoneValidator = validate(
    checkSchema(
        {
            name: nameSchema,
            image: imageSchema,
            options: optionsSchema,
            description: descriptionSchema,
            brand: brandSchema,
            screen_type: screenTypeSchema,
            resolution: resolutionSchema,
            operating_system: operatingSystemSchema,
            memory: memorySchema,
            chip: chipSchema,
            battery: batterySchema,
            rear_camera: rearCameraSchema,
            front_camera: frontCameraSchema,
            wifi: wifiSchema,
            jack_phone: jackPhoneSchema,
            size: sizeSchema,
            weight: weightSchema
        },
        ['body']
    )
)

export const getPhoneValidator = validate(
    checkSchema(
        {
            phone_id: phoneIdSchema
        },
        ['params']
    )
)

export const getAllPhonesValidator = validate(
    checkSchema(
        {
            brands: {
                optional: true,
                custom: {
                    options: async (value: string, { req }) => {
                        const brandValues = value ? value.split('|') : []

                        if (brandValues.length > 0 && !brandValues.every((item) => ObjectId.isValid(item))) {
                            throw new ErrorWithStatus({
                                message: PHONES_MESSAGES.INVALID_BRAND_ID,
                                status: HTTP_STATUS.BAD_REQUEST
                            })
                        }

                        const brands = await databaseService.brands
                            .find({
                                ...(brandValues.length > 0 && {
                                    _id: {
                                        $in: brandValues.map((item) => new ObjectId(item))
                                    }
                                })
                            })
                            .toArray()

                        if (brandValues.length > 0 && brands.length !== brandValues.length) {
                            throw new ErrorWithStatus({
                                message: PHONES_MESSAGES.BRAND_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        ;(req as Request).brands = brands

                        return true
                    }
                }
            }
        },
        ['query']
    )
)

export const updatePhoneValidator = validate(
    checkSchema(
        {
            phone_id: phoneIdSchema,
            name: {
                ...nameSchema,
                optional: true,
                notEmpty: false
            },
            image: {
                ...imageSchema,
                optional: true,
                notEmpty: false
            },
            options: {
                ...optionsSchema,
                optional: true
            },
            description: {
                ...descriptionSchema,
                optional: true,
                notEmpty: false
            },
            brand: {
                ...brandSchema,
                optional: true,
                notEmpty: false
            },
            screen_type: {
                ...screenTypeSchema,
                optional: true,
                notEmpty: false
            },
            resolution: {
                ...resolutionSchema,
                optional: true,
                notEmpty: false
            },
            operating_system: {
                ...operatingSystemSchema,
                optional: true,
                notEmpty: false
            },
            memory: {
                ...memorySchema,
                optional: true,
                notEmpty: false
            },
            chip: {
                ...chipSchema,
                optional: true,
                notEmpty: false
            },
            battery: {
                ...batterySchema,
                optional: true,
                notEmpty: false
            },
            rear_camera: {
                ...rearCameraSchema,
                optional: true,
                notEmpty: false
            },
            front_camera: {
                ...frontCameraSchema,
                optional: true,
                notEmpty: false
            },
            wifi: {
                ...wifiSchema,
                optional: true,
                notEmpty: false
            },
            jack_phone: {
                ...jackPhoneSchema,
                optional: true,
                notEmpty: false
            },
            size: {
                ...sizeSchema,
                optional: true,
                notEmpty: false
            },
            weight: {
                ...weightSchema,
                optional: true,
                notEmpty: false
            }
        },
        ['params', 'body']
    )
)

export const deletePhoneValidator = validate(
    checkSchema(
        {
            phone_id: phoneIdSchema
        },
        ['params']
    )
)
