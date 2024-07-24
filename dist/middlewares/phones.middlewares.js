"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePhoneValidator = exports.updatePhoneValidator = exports.getAllPhonesValidator = exports.getPhoneValidator = exports.createPhoneValidator = exports.deletePhoneOptionValidator = exports.updatePhoneOptionValidator = exports.createPhoneOptionValidator = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const common_middlewares_1 = require("./common.middlewares");
const Errors_1 = require("../models/Errors");
const database_services_1 = __importDefault(require("../services/database.services"));
const validation_1 = require("../utils/validation");
const colorSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.COLOR_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.COLOR_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 20
        },
        errorMessage: messages_1.PHONES_MESSAGES.COLOR_LENGTH_MUST_BE_FROM_1_TO_20
    }
};
const capacitySchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.CAPACITY_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.CAPACITY_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 20
        },
        errorMessage: messages_1.PHONES_MESSAGES.CAPACITY_LENGTH_MUST_BE_FROM_1_TO_20
    }
};
const priceSchema = {
    isInt: {
        errorMessage: messages_1.PHONES_MESSAGES.PRICE_MUST_BE_A_NUMBER
    }
};
const priceBeforeDiscountSchema = {
    isInt: {
        errorMessage: messages_1.PHONES_MESSAGES.PRICE_BEFORE_DISCOUNT_MUST_BE_A_NUMBER
    }
};
const quantitySchema = {
    isInt: {
        errorMessage: messages_1.PHONES_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
    }
};
const imagesSchema = {
    isArray: true,
    custom: {
        options: (value) => {
            if (value.length === 0) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.NO_IMAGE_PROVIDED,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            if (!value.every((item) => typeof item === 'string')) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.IMAGES_MUST_BE_AN_ARRAY_OF_STRING,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            return true;
        }
    },
    errorMessage: messages_1.PHONES_MESSAGES.IMAGES_MUST_BE_AN_ARRAY_OF_STRING
};
const nameSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.NAME_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.NAME_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const imageSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.NO_IMAGE_PROVIDED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.IMAGE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 25
        },
        errorMessage: messages_1.PHONES_MESSAGES.IMAGE_NOT_FOUND
    }
};
const optionsSchema = {
    isArray: true,
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (value.length === 0) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.MUST_PROVIDE_AT_LEAST_ONE_OPTION,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            if (!value.every((item) => typeof item === 'string' && mongodb_1.ObjectId.isValid(item))) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.INVALID_PHONE_OPTION_ID,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            const phone_options = yield database_services_1.default.phoneOptions
                .find({
                _id: {
                    $in: value.map((item) => new mongodb_1.ObjectId(item))
                }
            })
                .toArray();
            if (phone_options.length !== value.length) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.HAVE_PHONE_OPTION_NOT_FOUND,
                    status: httpStatus_1.default.NOT_FOUND
                });
            }
            ;
            req.phone_options = phone_options;
            return true;
        })
    }
};
const descriptionSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.DESCRIPTION_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
    },
    trim: true
};
const brandSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.BRAND_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.BRAND_MUST_BE_A_STRING
    },
    trim: true,
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(value)) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.INVALID_BRAND_ID,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            const brand = yield database_services_1.default.brands.findOne({
                _id: new mongodb_1.ObjectId(value)
            });
            if (brand === null) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.BRAND_NOT_FOUND,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            ;
            req.brand = brand;
            return true;
        })
    }
};
const screenTypeSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.SCREEN_TYPE_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.SCREEN_TYPE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.SCREEN_TYPE_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const resolutionSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.RESOLUTION_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.RESOLUTION_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.RESOLUTION_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const operatingSystemSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.OPERATING_SYSTEM_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.OPERATING_SYSTEM_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.OPERATING_SYSTEM_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const memorySchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.MEMORY_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.MEMORY_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.MEMORY_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const chipSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.CHIP_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.CHIP_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.CHIP_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const batterySchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.BATTERY_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.BATTERY_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.BATTERY_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const rearCameraSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.REAR_CAMERA_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.REAR_CAMERA_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.REAR_CAMERA_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const frontCameraSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.FRONT_CAMERA_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.FRONT_CAMERA_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.FRONT_CAMERA_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const wifiSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.WIFI_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.WIFI_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.WIFI_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const jackPhoneSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.JACK_PHONE_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.JACK_PHONE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.JACK_PHONE_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const sizeSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.SIZE_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.SIZE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.SIZE_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
const weightSchema = {
    notEmpty: {
        errorMessage: messages_1.PHONES_MESSAGES.WEIGHT_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.PHONES_MESSAGES.WEIGHT_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: messages_1.PHONES_MESSAGES.WEIGHT_LENGTH_MUST_BE_FROM_1_TO_200
    }
};
exports.createPhoneOptionValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    color: colorSchema,
    capacity: capacitySchema,
    price: priceSchema,
    price_before_discount: priceBeforeDiscountSchema,
    quantity: quantitySchema,
    images: imagesSchema
}, ['body']));
exports.updatePhoneOptionValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    phone_option_id: common_middlewares_1.phoneOptionIdSchema,
    color: Object.assign(Object.assign({}, colorSchema), { optional: true, notEmpty: false }),
    capacity: Object.assign(Object.assign({}, capacitySchema), { optional: true, notEmpty: false }),
    price: Object.assign(Object.assign({}, priceSchema), { optional: true }),
    price_before_discount: Object.assign(Object.assign({}, priceBeforeDiscountSchema), { optional: true }),
    quantity: Object.assign(Object.assign({}, quantitySchema), { optional: true }),
    images: Object.assign(Object.assign({}, imagesSchema), { optional: true })
}, ['params', 'body']));
exports.deletePhoneOptionValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    phone_option_id: common_middlewares_1.phoneOptionIdSchema
}, ['params']));
exports.createPhoneValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
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
}, ['body']));
exports.getPhoneValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    phone_id: common_middlewares_1.phoneIdSchema
}, ['params']));
exports.getAllPhonesValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    brands: {
        optional: true,
        custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const brandValues = value ? value.split('|') : [];
                if (brandValues.length > 0 && !brandValues.every((item) => mongodb_1.ObjectId.isValid(item))) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.PHONES_MESSAGES.INVALID_BRAND_ID,
                        status: httpStatus_1.default.BAD_REQUEST
                    });
                }
                const brands = yield database_services_1.default.brands
                    .find(Object.assign({}, (brandValues.length > 0 && {
                    _id: {
                        $in: brandValues.map((item) => new mongodb_1.ObjectId(item))
                    }
                })))
                    .toArray();
                if (brandValues.length > 0 && brands.length !== brandValues.length) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.PHONES_MESSAGES.BRAND_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                ;
                req.brands = brands;
                return true;
            })
        }
    }
}, ['query']));
exports.updatePhoneValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    phone_id: common_middlewares_1.phoneIdSchema,
    name: Object.assign(Object.assign({}, nameSchema), { optional: true, notEmpty: false }),
    image: Object.assign(Object.assign({}, imageSchema), { optional: true, notEmpty: false }),
    options: Object.assign(Object.assign({}, optionsSchema), { optional: true }),
    description: Object.assign(Object.assign({}, descriptionSchema), { optional: true, notEmpty: false }),
    brand: Object.assign(Object.assign({}, brandSchema), { optional: true, notEmpty: false }),
    screen_type: Object.assign(Object.assign({}, screenTypeSchema), { optional: true, notEmpty: false }),
    resolution: Object.assign(Object.assign({}, resolutionSchema), { optional: true, notEmpty: false }),
    operating_system: Object.assign(Object.assign({}, operatingSystemSchema), { optional: true, notEmpty: false }),
    memory: Object.assign(Object.assign({}, memorySchema), { optional: true, notEmpty: false }),
    chip: Object.assign(Object.assign({}, chipSchema), { optional: true, notEmpty: false }),
    battery: Object.assign(Object.assign({}, batterySchema), { optional: true, notEmpty: false }),
    rear_camera: Object.assign(Object.assign({}, rearCameraSchema), { optional: true, notEmpty: false }),
    front_camera: Object.assign(Object.assign({}, frontCameraSchema), { optional: true, notEmpty: false }),
    wifi: Object.assign(Object.assign({}, wifiSchema), { optional: true, notEmpty: false }),
    jack_phone: Object.assign(Object.assign({}, jackPhoneSchema), { optional: true, notEmpty: false }),
    size: Object.assign(Object.assign({}, sizeSchema), { optional: true, notEmpty: false }),
    weight: Object.assign(Object.assign({}, weightSchema), { optional: true, notEmpty: false })
}, ['params', 'body']));
exports.deletePhoneValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    phone_id: common_middlewares_1.phoneIdSchema
}, ['params']));
