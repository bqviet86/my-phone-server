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
exports.deleteCartValidator = exports.updateCartValidator = exports.getCartValidator = exports.isPhoneOptionIdMatched = exports.addToCartValidator = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const enums_1 = require("../constants/enums");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const common_middlewares_1 = require("./common.middlewares");
const Errors_1 = require("../models/Errors");
const database_services_1 = __importDefault(require("../services/database.services"));
const validation_1 = require("../utils/validation");
const newPhoneOptionIdSchema = Object.assign({ notEmpty: {
        errorMessage: messages_1.CARTS_MESSAGES.PHONE_OPTION_ID_IS_REQUIRED
    }, isString: {
        errorMessage: messages_1.CARTS_MESSAGES.PHONE_OPTION_ID_MUST_BE_A_STRING
    } }, common_middlewares_1.phoneOptionIdSchema);
const quantitySchema = {
    notEmpty: {
        errorMessage: messages_1.CARTS_MESSAGES.QUANTITY_IS_REQUIRED
    },
    isInt: {
        errorMessage: messages_1.CARTS_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
    }
};
const cartIdSchema = {
    notEmpty: {
        errorMessage: messages_1.CARTS_MESSAGES.CART_ID_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.CARTS_MESSAGES.CART_ID_MUST_BE_A_STRING
    },
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { user_id } = req.decoded_authorization;
            if (!mongodb_1.ObjectId.isValid(value)) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.CARTS_MESSAGES.INVALID_CART_ID,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            const [cart] = yield database_services_1.default.carts
                .aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(value),
                        user_id: new mongodb_1.ObjectId(user_id)
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
                .toArray();
            if (cart === undefined) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.CARTS_MESSAGES.CART_NOT_FOUND,
                    status: httpStatus_1.default.NOT_FOUND
                });
            }
            ;
            req.phone = cart.phone;
            return true;
        })
    }
};
exports.addToCartValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    phone_id: Object.assign({ notEmpty: {
            errorMessage: messages_1.CARTS_MESSAGES.PHONE_ID_IS_REQUIRED
        }, isString: {
            errorMessage: messages_1.CARTS_MESSAGES.PHONE_ID_MUST_BE_A_STRING
        } }, common_middlewares_1.phoneIdSchema),
    phone_option_id: newPhoneOptionIdSchema,
    quantity: quantitySchema
}, ['body']));
const isPhoneOptionIdMatched = (req, res, next) => {
    const phone = req.phone;
    const { phone_option_id } = req.body;
    let phone_option_matched = null;
    for (const option of phone.options) {
        if (option._id.equals(phone_option_id)) {
            phone_option_matched = option;
            break;
        }
    }
    if (phone_option_matched === null) {
        return next(new Errors_1.ErrorWithStatus({
            message: messages_1.CARTS_MESSAGES.INVALID_PHONE_OPTION_ID,
            status: httpStatus_1.default.BAD_REQUEST
        }));
    }
    next();
};
exports.isPhoneOptionIdMatched = isPhoneOptionIdMatched;
exports.getCartValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    carts: {
        optional: true,
        custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const cartValues = value ? value.split('|') : [];
                if (cartValues.length > 0 && !cartValues.every((item) => mongodb_1.ObjectId.isValid(item))) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.CARTS_MESSAGES.INVALID_CART_ID,
                        status: httpStatus_1.default.BAD_REQUEST
                    });
                }
                const { user_id } = req.decoded_authorization;
                const carts = yield database_services_1.default.carts
                    .aggregate([
                    {
                        $match: Object.assign(Object.assign({}, (cartValues.length > 0 && {
                            _id: {
                                $in: cartValues.map((item) => new mongodb_1.ObjectId(item))
                            }
                        })), { user_id: new mongodb_1.ObjectId(user_id), cart_status: enums_1.CartStatus.Pending })
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
                    .toArray();
                if (cartValues.length > 0 && carts.length !== cartValues.length) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.CARTS_MESSAGES.CART_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                ;
                req.carts = carts;
                return true;
            })
        }
    }
}, ['query']));
exports.updateCartValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    cart_id: cartIdSchema,
    phone_option_id: newPhoneOptionIdSchema,
    quantity: quantitySchema
}, ['params', 'body']));
exports.deleteCartValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    cart_id: cartIdSchema
}, ['params']));
