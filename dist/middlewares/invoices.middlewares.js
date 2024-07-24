"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoiceValidator = exports.getInvoiceValidator = exports.createInvoiceValidator = void 0;
const express_validator_1 = require("express-validator");
const common_middlewares_1 = require("./common.middlewares");
const validation_1 = require("../utils/validation");
exports.createInvoiceValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    order_id: common_middlewares_1.orderIdSchema
}, ['body']));
exports.getInvoiceValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    order_id: common_middlewares_1.orderIdSchema
}, ['params']));
exports.deleteInvoiceValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    order_id: common_middlewares_1.orderIdSchema
}, ['params']));
