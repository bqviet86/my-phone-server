"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchValidator = void 0;
const express_validator_1 = require("express-validator");
const validation_1 = require("../utils/validation");
exports.searchValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    content: {
        isString: {
            errorMessage: 'Nội dung phải là chuỗi'
        }
    }
}, ['query']));
