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
exports.updateOrderStatusValidator = exports.confirmPaymentValidator = exports.isAllowedToUpdateOrder = exports.updateOrderValidator = exports.getAllOrdersValidator = exports.getOrderValidator = exports.createOrderValidator = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const enums_1 = require("../constants/enums");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const common_middlewares_1 = require("./common.middlewares");
const Errors_1 = require("../models/Errors");
const database_services_1 = __importDefault(require("../services/database.services"));
const commons_1 = require("../utils/commons");
const validation_1 = require("../utils/validation");
const paymentMethodValues = (0, commons_1.numberEnumToArray)(enums_1.PaymentMethod);
const orderStatusValues = (0, commons_1.numberEnumToArray)(enums_1.OrderStatus);
const paymentMethodSchema = {
    isIn: {
        options: [paymentMethodValues],
        errorMessage: messages_1.ORDERS_MESSAGES.INVALID_PAYMENT_METHOD
    }
};
const cartsCustomFunction = (value, { req }, cart_status = enums_1.CartStatus.Pending) => __awaiter(void 0, void 0, void 0, function* () {
    if (value.length === 0) {
        throw new Errors_1.ErrorWithStatus({
            message: messages_1.ORDERS_MESSAGES.CARTS_IS_EMPTY,
            status: httpStatus_1.default.BAD_REQUEST
        });
    }
    if (!value.every((item) => typeof item === 'string' && mongodb_1.ObjectId.isValid(item))) {
        throw new Errors_1.ErrorWithStatus({
            message: messages_1.ORDERS_MESSAGES.INVALID_CARTS_ID,
            status: httpStatus_1.default.BAD_REQUEST
        });
    }
    const { user_id } = req.decoded_authorization;
    const carts = yield database_services_1.default.carts
        .find({
        _id: {
            $in: value.map((item) => new mongodb_1.ObjectId(item))
        },
        user_id: new mongodb_1.ObjectId(user_id),
        cart_status
    })
        .toArray();
    if (carts.length !== value.length) {
        throw new Errors_1.ErrorWithStatus({
            message: messages_1.ORDERS_MESSAGES.HAVE_CART_NOT_FOUND,
            status: httpStatus_1.default.NOT_FOUND
        });
    }
    ;
    req.carts = carts;
    return true;
});
const cartsSchema = {
    isArray: true,
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            return cartsCustomFunction(value, { req: req });
        })
    }
};
const addressCustomFunction = (value, { req }, optional = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (optional && !value) {
        return true;
    }
    if (!mongodb_1.ObjectId.isValid(value)) {
        throw new Errors_1.ErrorWithStatus({
            message: messages_1.ORDERS_MESSAGES.INVALID_ADDRESS_ID,
            status: httpStatus_1.default.BAD_REQUEST
        });
    }
    const { user_id } = req.decoded_authorization;
    const address = yield database_services_1.default.addresses.findOne({
        _id: new mongodb_1.ObjectId(value),
        user_id: new mongodb_1.ObjectId(user_id)
    });
    if (address === null) {
        throw new Errors_1.ErrorWithStatus({
            message: messages_1.ORDERS_MESSAGES.ADDRESS_NOT_FOUND,
            status: httpStatus_1.default.NOT_FOUND
        });
    }
    ;
    req.delivery_address = {
        name: address.name,
        email: address.email,
        phone_number: address.phone_number,
        specific_address: address.specific_address
    };
    req.address = address;
    return true;
});
const addressSchema = {
    trim: true,
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            return addressCustomFunction(value, { req: req });
        })
    }
};
const contentSchema = {
    optional: true,
    isString: {
        errorMessage: messages_1.ORDERS_MESSAGES.CONTENT_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 0,
            max: 500
        },
        errorMessage: messages_1.ORDERS_MESSAGES.CONTENT_MUST_BE_FROM_0_TO_500_CHARACTERS
    }
};
exports.createOrderValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    payment_method: paymentMethodSchema,
    carts: cartsSchema,
    address: addressSchema,
    content: contentSchema
}, ['params', 'body']));
exports.getOrderValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    order_id: common_middlewares_1.orderIdSchema
}, ['params']));
exports.getAllOrdersValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    order_status: {
        optional: true,
        custom: {
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                const orderStatus = Number(value);
                if (value !== '' && !orderStatusValues.includes(orderStatus)) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.ORDERS_MESSAGES.INVALID_ORDER_STATUS,
                        status: httpStatus_1.default.BAD_REQUEST
                    });
                }
                return true;
            })
        }
    }
}, ['query']));
exports.updateOrderValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    order_id: common_middlewares_1.orderIdSchema,
    payment_method: paymentMethodSchema,
    carts: Object.assign(Object.assign({}, cartsSchema), { custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                return cartsCustomFunction(value, { req: req }, enums_1.CartStatus.Ordered);
            })
        } }),
    address: addressSchema,
    content: contentSchema
}, ['params', 'body']));
const isAllowedToUpdateOrder = (req, res, next) => {
    const { user_id, role } = req.decoded_authorization;
    const order = req.order;
    if (role === enums_1.UserRole.Admin) {
        return next();
    }
    if ((role === enums_1.UserRole.User && user_id !== order.user._id.toString()) ||
        ![enums_1.OrderStatus.PendingPayment, enums_1.OrderStatus.PendingConfirmation].includes(order.order_status) ||
        (order.payment.payment_method === enums_1.PaymentMethod.CreditCard &&
            order.order_status === enums_1.OrderStatus.PendingConfirmation)) {
        throw new Errors_1.ErrorWithStatus({
            message: messages_1.ORDERS_MESSAGES.NOT_ALLOWED_TO_UPDATE_ORDER,
            status: httpStatus_1.default.FORBIDDEN
        });
    }
    next();
};
exports.isAllowedToUpdateOrder = isAllowedToUpdateOrder;
exports.confirmPaymentValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    order_id: common_middlewares_1.orderIdSchema,
    payment_method: paymentMethodSchema,
    carts: Object.assign(Object.assign({}, cartsSchema), { custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                return cartsCustomFunction(value, { req: req }, enums_1.CartStatus.Ordered);
            })
        } }),
    address: Object.assign(Object.assign({}, addressSchema), { custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                return addressCustomFunction(value, { req: req }, true);
            })
        } }),
    content: contentSchema
}, ['params', 'body']));
exports.updateOrderStatusValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    order_id: common_middlewares_1.orderIdSchema,
    order_status: {
        isIn: {
            options: [orderStatusValues],
            errorMessage: messages_1.ORDERS_MESSAGES.INVALID_ORDER_STATUS
        }
    }
}, ['params', 'body']));
