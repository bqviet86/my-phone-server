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
exports.deleteBrandValidator = exports.createBrandValidator = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const Errors_1 = require("../models/Errors");
const database_services_1 = __importDefault(require("../services/database.services"));
const validation_1 = require("../utils/validation");
exports.createBrandValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    name: {
        notEmpty: {
            errorMessage: messages_1.BRANDS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
            errorMessage: messages_1.BRANDS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 20
            },
            errorMessage: messages_1.BRANDS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_20
        }
    }
}, ['body']));
exports.deleteBrandValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    brand_id: {
        trim: true,
        custom: {
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                if (!mongodb_1.ObjectId.isValid(value)) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.BRANDS_MESSAGES.BRAND_ID_IS_INVALID,
                        status: httpStatus_1.default.BAD_REQUEST
                    });
                }
                const brand = yield database_services_1.default.brands.findOne({
                    _id: new mongodb_1.ObjectId(value)
                });
                if (brand === null) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.BRANDS_MESSAGES.BRAND_IS_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                return true;
            })
        }
    }
}, ['params']));
