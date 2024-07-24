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
exports.orderIdSchema = exports.paginationValidator = exports.phoneIdSchema = exports.phoneOptionIdSchema = exports.filterMiddleware = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const lodash_1 = require("lodash");
const enums_1 = require("../constants/enums");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const Errors_1 = require("../models/Errors");
const database_services_1 = __importDefault(require("../services/database.services"));
const validation_1 = require("../utils/validation");
// Middlewares
const filterMiddleware = (filterKeys) => (req, res, next) => {
    req.body = (0, lodash_1.pick)(req.body, filterKeys);
    next();
};
exports.filterMiddleware = filterMiddleware;
// Schemas
exports.phoneOptionIdSchema = {
    trim: true,
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(value)) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.INVALID_PHONE_OPTION_ID,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            const phone_option = yield database_services_1.default.phoneOptions.findOne({
                _id: new mongodb_1.ObjectId(value)
            });
            if (phone_option === null) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.PHONE_OPTION_NOT_FOUND,
                    status: httpStatus_1.default.NOT_FOUND
                });
            }
            ;
            req.phone_option = phone_option;
            return true;
        })
    }
};
exports.phoneIdSchema = {
    trim: true,
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(value)) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.INVALID_PHONE_ID,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            const [phone] = yield database_services_1.default.phones
                .aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(value)
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
                .toArray();
            if (phone === undefined) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.PHONES_MESSAGES.PHONE_NOT_FOUND,
                    status: httpStatus_1.default.NOT_FOUND
                });
            }
            ;
            req.phone = phone;
            return true;
        })
    }
};
exports.paginationValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    page: {
        notEmpty: {
            errorMessage: 'Page không được để trống'
        },
        isNumeric: {
            errorMessage: 'Page phải là một số'
        },
        custom: {
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                const num = Number(value);
                if (num < 1) {
                    throw new Error('page >= 1');
                }
                return true;
            })
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
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                const num = Number(value);
                if (num > 100 || num < 1) {
                    throw new Error('1 <= limit <= 100');
                }
                return true;
            })
        }
    }
}, ['query']));
exports.orderIdSchema = {
    trim: true,
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(value)) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.ORDERS_MESSAGES.INVALID_ORDER_ID,
                    status: httpStatus_1.default.BAD_REQUEST
                });
            }
            const { user_id, role } = req.decoded_authorization;
            const [order] = yield database_services_1.default.orders
                .aggregate([
                {
                    $match: Object.assign({ _id: new mongodb_1.ObjectId(value) }, (role === enums_1.UserRole.User && { user_id: new mongodb_1.ObjectId(user_id) }))
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
                .toArray();
            if (order === undefined) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.ORDERS_MESSAGES.ORDER_NOT_FOUND,
                    status: httpStatus_1.default.NOT_FOUND
                });
            }
            ;
            req.order = order;
            return true;
        })
    }
};
