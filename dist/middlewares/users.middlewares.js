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
exports.isAdminValidator = exports.deleteAddressValidator = exports.updateAddressValidator = exports.createAddressValidator = exports.changePasswordValidator = exports.updateMeValidator = exports.getAllUsersValidator = exports.resetPasswordValidator = exports.verifyForgotPasswordTokenValidator = exports.forgotPasswordValidator = exports.emailVerifyTokenValidator = exports.refreshTokenValidator = exports.accessTokenValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const lodash_1 = require("lodash");
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
const enums_1 = require("../constants/enums");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const Errors_1 = require("../models/Errors");
const database_services_1 = __importDefault(require("../services/database.services"));
const users_services_1 = __importDefault(require("../services/users.services"));
const crypto_1 = require("../utils/crypto");
const commons_1 = require("../utils/commons");
const jwt_1 = require("../utils/jwt");
const validation_1 = require("../utils/validation");
(0, dotenv_1.config)();
const sexValues = (0, commons_1.numberEnumToArray)(enums_1.Sex);
// Lỗi mặc định 422, muón lỗi khác thì dùng ErrorWithStatus
const nameSchema = {
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.NAME_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.NAME_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 100
        },
        errorMessage: messages_1.USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
    }
};
const emailSchema = {
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.EMAIL_IS_REQUIRED
    },
    isEmail: {
        errorMessage: messages_1.USERS_MESSAGES.EMAIL_IS_INVALID
    },
    trim: true
};
const passwordSchema = {
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.PASSWORD_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
    },
    isLength: {
        options: {
            min: 6,
            max: 50
        },
        errorMessage: messages_1.USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
    },
    isStrongPassword: {
        options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        },
        errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
    }
};
const confirmPasswordSchema = {
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
    },
    isLength: {
        options: {
            min: 6,
            max: 50
        },
        errorMessage: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
    },
    isStrongPassword: {
        options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        },
        errorMessage: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
    },
    custom: {
        options: (value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD);
            }
            return true;
        }
    }
};
const forgotPasswordTokenSchema = {
    trim: true,
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!value) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                    status: httpStatus_1.default.UNAUTHORIZED
                });
            }
            try {
                const decoded_forgot_password_token = yield (0, jwt_1.verifyToken)({
                    token: value,
                    secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN
                });
                const { user_id } = decoded_forgot_password_token;
                const user = yield database_services_1.default.users.findOne({
                    _id: new mongodb_1.ObjectId(user_id)
                });
                if (user === null) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.USER_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                if (user.forgot_password_token !== value) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                ;
                req.decoded_forgot_password_token = decoded_forgot_password_token;
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                    throw new Errors_1.ErrorWithStatus({
                        message: (0, lodash_1.capitalize)(error.message),
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                throw error;
            }
            return true;
        })
    }
};
const dateOfBirthSchema = {
    isISO8601: {
        options: {
            strict: true,
            strictSeparator: true
        },
        errorMessage: messages_1.USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
    }
};
const sexSchema = {
    isIn: {
        options: [sexValues],
        errorMessage: messages_1.USERS_MESSAGES.SEX_IS_INVALID
    }
};
const phoneNumberSchema = {
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.PHONE_NUMBER_IS_REQUIRED
    },
    isMobilePhone: {
        options: ['vi-VN'],
        errorMessage: messages_1.USERS_MESSAGES.PHONE_NUMBER_IS_INVALID
    },
    trim: true
};
const addressIdSchema = {
    trim: true,
    custom: {
        options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(value)) {
                throw new Errors_1.ErrorWithStatus({
                    message: messages_1.USERS_MESSAGES.INVALID_ADDRESS_ID,
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
                    message: messages_1.USERS_MESSAGES.ADDRESS_NOT_FOUND,
                    status: httpStatus_1.default.NOT_FOUND
                });
            }
            return true;
        })
    }
};
const provinceSchema = {
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.PROVINCE_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.PROVINCE_MUST_BE_A_STRING
    },
    trim: true
};
const districtSchema = {
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.DISTRICT_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.DISTRICT_MUST_BE_A_STRING
    },
    trim: true
};
const wardSchema = {
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.WARD_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.WARD_MUST_BE_A_STRING
    },
    trim: true
};
const specificAddressSchema = {
    notEmpty: {
        errorMessage: messages_1.USERS_MESSAGES.SPECIFIC_ADDRESS_IS_REQUIRED
    },
    isString: {
        errorMessage: messages_1.USERS_MESSAGES.SPECIFIC_ADDRESS_MUST_BE_A_STRING
    },
    trim: true
};
exports.registerValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    name: nameSchema,
    email: Object.assign(Object.assign({}, emailSchema), { custom: {
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                const isExistEmail = yield users_services_1.default.checkEmailExist(value);
                if (isExistEmail) {
                    throw new Error(messages_1.USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
                }
                return true;
            })
        } }),
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    date_of_birth: dateOfBirthSchema,
    sex: sexSchema,
    phone_number: phoneNumberSchema
}, ['body']));
exports.loginValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    email: Object.assign(Object.assign({}, emailSchema), { custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield database_services_1.default.users.findOne({
                    email: value
                });
                if (user === null) {
                    throw new Error(messages_1.USERS_MESSAGES.YOU_HAVE_NOT_REGISTERED_WITH_THIS_EMAIL);
                }
                ;
                req.user = user;
                return true;
            })
        } }),
    password: Object.assign(Object.assign({}, passwordSchema), { custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const { email } = req.body;
                const user = yield database_services_1.default.users.findOne({ email });
                if (user && (0, crypto_1.hashPassword)(value) !== user.password) {
                    throw new Error(messages_1.USERS_MESSAGES.INCORRECT_PASSWORD);
                }
                return true;
            })
        } })
}, ['body']));
exports.accessTokenValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    Authorization: {
        trim: true,
        custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const access_token = (value || '').split(' ')[1];
                if (!access_token) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                try {
                    const decoded_authorization = yield (0, jwt_1.verifyToken)({
                        token: access_token,
                        secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN
                    });
                    req.decoded_authorization = decoded_authorization;
                }
                catch (error) {
                    throw new Errors_1.ErrorWithStatus({
                        message: (0, lodash_1.capitalize)(error.message),
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                return true;
            })
        }
    }
}, ['headers']));
exports.refreshTokenValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    refresh_token: {
        trim: true,
        custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                if (!value) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                try {
                    const [decoded_refresh_token, refresh_token] = yield Promise.all([
                        (0, jwt_1.verifyToken)({
                            token: value,
                            secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN
                        }),
                        database_services_1.default.refreshTokens.findOne({ token: value })
                    ]);
                    if (refresh_token === null) {
                        throw new Errors_1.ErrorWithStatus({
                            message: messages_1.USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                    ;
                    req.decoded_refresh_token = decoded_refresh_token;
                }
                catch (error) {
                    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                        throw new Errors_1.ErrorWithStatus({
                            message: (0, lodash_1.capitalize)(error.message),
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                    throw error;
                }
                return true;
            })
        }
    }
}, ['body']));
exports.emailVerifyTokenValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    email_verify_token: {
        trim: true,
        custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                if (!value) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                try {
                    const decoded_email_verify_token = yield (0, jwt_1.verifyToken)({
                        token: value,
                        secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN
                    });
                    const { user_id } = decoded_email_verify_token;
                    const user = yield database_services_1.default.users.findOne({
                        _id: new mongodb_1.ObjectId(user_id)
                    });
                    if (user === null) {
                        throw new Errors_1.ErrorWithStatus({
                            message: messages_1.USERS_MESSAGES.USER_NOT_FOUND,
                            status: httpStatus_1.default.NOT_FOUND
                        });
                    }
                    ;
                    req.user = user;
                    req.decoded_email_verify_token = decoded_email_verify_token;
                }
                catch (error) {
                    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                        throw new Errors_1.ErrorWithStatus({
                            message: (0, lodash_1.capitalize)(error.message),
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                    throw error;
                }
                return true;
            })
        }
    }
}, ['body']));
exports.forgotPasswordValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    email: Object.assign(Object.assign({}, emailSchema), { custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield database_services_1.default.users.findOne({
                    email: value
                });
                if (user === null) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.USER_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                ;
                req.user = user;
                return true;
            })
        } })
}, ['body']));
exports.verifyForgotPasswordTokenValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    forgot_password_token: forgotPasswordTokenSchema
}, ['body']));
exports.resetPasswordValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    forgot_password_token: forgotPasswordTokenSchema,
    password: passwordSchema,
    confirm_password: confirmPasswordSchema
}, ['body']));
exports.getAllUsersValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    search: {
        optional: true,
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.SEARCH_MUST_BE_A_STRING
        }
    }
}, ['query']));
exports.updateMeValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    name: nameSchema,
    email: emailSchema,
    date_of_birth: dateOfBirthSchema,
    sex: sexSchema,
    phone_number: phoneNumberSchema
}, ['body']));
exports.changePasswordValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    old_password: Object.assign(Object.assign({}, passwordSchema), { custom: {
            options: (value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
                const { user_id } = req.decoded_authorization;
                const user = yield database_services_1.default.users.findOne({
                    _id: new mongodb_1.ObjectId(user_id)
                });
                if (user === null) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.USER_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                if ((0, crypto_1.hashPassword)(value) !== user.password) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                return true;
            })
        } }),
    password: passwordSchema,
    confirm_password: confirmPasswordSchema
}, ['body']));
exports.createAddressValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    name: nameSchema,
    phone_number: phoneNumberSchema,
    email: emailSchema,
    // province: provinceSchema,
    // district: districtSchema,
    // ward: wardSchema,
    specific_address: specificAddressSchema
}, ['body']));
exports.updateAddressValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    address_id: addressIdSchema,
    name: nameSchema,
    phone_number: phoneNumberSchema,
    email: emailSchema,
    // province: {
    //     ...provinceSchema,
    //     optional: true,
    //     notEmpty: false
    // },
    // district: {
    //     ...districtSchema,
    //     optional: true,
    //     notEmpty: false
    // },
    // ward: {
    //     ...wardSchema,
    //     optional: true,
    //     notEmpty: false
    // },
    specific_address: specificAddressSchema
}, ['params', 'body']));
exports.deleteAddressValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    address_id: addressIdSchema
}, ['params']));
const isAdminValidator = (req, res, next) => {
    const { role } = req.decoded_authorization;
    if (role !== enums_1.UserRole.Admin) {
        return next(new Errors_1.ErrorWithStatus({
            message: messages_1.USERS_MESSAGES.USER_NOT_ADMIN,
            status: httpStatus_1.default.FORBIDDEN
        }));
    }
    next();
};
exports.isAdminValidator = isAdminValidator;
