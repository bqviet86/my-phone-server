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
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
const enums_1 = require("../constants/enums");
const dir_1 = require("../constants/dir");
const messages_1 = require("../constants/messages");
const User_schema_1 = __importDefault(require("../models/schemas/User.schema"));
const RefreshToken_schema_1 = __importDefault(require("../models/schemas/RefreshToken.schema"));
const Address_schema_1 = __importDefault(require("../models/schemas/Address.schema"));
const database_services_1 = __importDefault(require("./database.services"));
const medias_services_1 = __importDefault(require("./medias.services"));
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
(0, dotenv_1.config)();
class UserService {
    signAccessToken({ user_id, verify, role }) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                verify,
                role,
                token_type: enums_1.TokenTypes.AccessToken
            },
            privateKey: process.env.JWT_SECRET_ACCESS_TOKEN,
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN
            }
        });
    }
    signRefreshToken({ user_id, verify, role, exp }) {
        if (exp) {
            return (0, jwt_1.signToken)({
                payload: {
                    user_id,
                    verify,
                    role,
                    token_type: enums_1.TokenTypes.RefreshToken,
                    exp
                },
                privateKey: process.env.JWT_SECRET_REFRESH_TOKEN
            });
        }
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                verify,
                role,
                token_type: enums_1.TokenTypes.RefreshToken
            },
            privateKey: process.env.JWT_SECRET_REFRESH_TOKEN,
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN
            }
        });
    }
    signAccessTokenAndRefreshToken({ user_id, verify, role }) {
        return Promise.all([
            this.signAccessToken({ user_id, verify, role }),
            this.signRefreshToken({ user_id, verify, role })
        ]);
    }
    signEmailVerifyToken({ user_id, verify, role }) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                verify,
                role,
                token_type: enums_1.TokenTypes.EmailVerifyToken
            },
            privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN,
            options: {
                expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN
            }
        });
    }
    signForgotPasswordToken({ user_id, verify, role }) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                verify,
                role,
                token_type: enums_1.TokenTypes.ForgotPasswordToken
            },
            privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
            options: {
                expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_IN
            }
        });
    }
    decodeRefreshToken(refresh_token) {
        return (0, jwt_1.verifyToken)({
            token: refresh_token,
            secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN
        });
    }
    checkEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_services_1.default.users.findOne({ email });
            return Boolean(user);
        });
    }
    checkUsernameExist(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_services_1.default.users.findOne({ username });
            return Boolean(user);
        });
    }
    register(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = new mongodb_1.ObjectId();
            const [email_verify_token, [access_token, refresh_token]] = yield Promise.all([
                this.signEmailVerifyToken({
                    user_id: user_id.toString(),
                    verify: enums_1.UserVerifyStatus.Unverified,
                    role: enums_1.UserRole.User
                }),
                this.signAccessTokenAndRefreshToken({
                    user_id: user_id.toString(),
                    verify: enums_1.UserVerifyStatus.Unverified,
                    role: enums_1.UserRole.User
                })
            ]);
            const { iat, exp } = yield this.decodeRefreshToken(refresh_token);
            yield Promise.all([
                database_services_1.default.users.insertOne(new User_schema_1.default(Object.assign(Object.assign({}, payload), { _id: user_id, password: (0, crypto_1.hashPassword)(payload.password), date_of_birth: new Date(payload.date_of_birth), email_verify_token }))),
                database_services_1.default.refreshTokens.insertOne(new RefreshToken_schema_1.default({
                    token: refresh_token,
                    user_id,
                    iat,
                    exp
                }))
            ]);
            return { access_token, refresh_token };
        });
    }
    login({ user_id, verify, role }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [access_token, refresh_token] = yield this.signAccessTokenAndRefreshToken({ user_id, verify, role });
            const { iat, exp } = yield this.decodeRefreshToken(refresh_token);
            yield database_services_1.default.refreshTokens.insertOne(new RefreshToken_schema_1.default({
                token: refresh_token,
                user_id: new mongodb_1.ObjectId(user_id),
                iat,
                exp
            }));
            return { access_token, refresh_token };
        });
    }
    logout(refresh_token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_services_1.default.refreshTokens.deleteOne({ token: refresh_token });
            return { message: messages_1.USERS_MESSAGES.LOGOUT_SUCCESS };
        });
    }
    verifyEmail(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [[access_token, refresh_token], _] = yield Promise.all([
                this.signAccessTokenAndRefreshToken({ user_id, verify: enums_1.UserVerifyStatus.Verified, role: enums_1.UserRole.User }),
                database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
                    $set: {
                        email_verify_token: '',
                        verify: enums_1.UserVerifyStatus.Verified
                    },
                    $currentDate: {
                        updated_at: true
                    }
                })
            ]);
            const { iat, exp } = yield this.decodeRefreshToken(refresh_token);
            yield database_services_1.default.refreshTokens.insertOne(new RefreshToken_schema_1.default({
                user_id: new mongodb_1.ObjectId(user_id),
                token: refresh_token,
                iat,
                exp
            }));
            return { access_token, refresh_token };
        });
    }
    resendVerifyEmail(user_id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const email_verify_token = yield this.signEmailVerifyToken({
                user_id,
                verify: enums_1.UserVerifyStatus.Unverified,
                role: enums_1.UserRole.User
            });
            yield database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
                $set: {
                    email_verify_token
                },
                $currentDate: {
                    updated_at: true
                }
            });
            return { message: messages_1.USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS };
        });
    }
    forgotPassword({ user_id, email, verify, role }) {
        return __awaiter(this, void 0, void 0, function* () {
            const forgot_password_token = yield this.signForgotPasswordToken({ user_id, verify, role });
            yield database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
                $set: {
                    forgot_password_token
                },
                $currentDate: {
                    updated_at: true
                }
            });
            role === enums_1.UserRole.Admin
                ? yield (0, email_1.sendForgotPasswordAdminEmail)(email, forgot_password_token)
                : yield (0, email_1.sendForgotPasswordEmail)(email, forgot_password_token);
            return { message: messages_1.USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD };
        });
    }
    resetPassword(user_id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
                $set: {
                    password: (0, crypto_1.hashPassword)(password),
                    forgot_password_token: ''
                },
                $currentDate: {
                    updated_at: true
                }
            });
            return { message: messages_1.USERS_MESSAGES.RESET_PASSWORD_SUCCESS };
        });
    }
    refreshToken({ user_id, verify, role, exp, refresh_token }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [new_access_token, new_refresh_token, _] = yield Promise.all([
                this.signAccessToken({ user_id, verify, role }),
                this.signRefreshToken({ user_id, verify, role, exp }),
                database_services_1.default.refreshTokens.deleteOne({ token: refresh_token })
            ]);
            const decode_new_refresh_token = yield this.decodeRefreshToken(new_refresh_token);
            yield database_services_1.default.refreshTokens.insertOne(new RefreshToken_schema_1.default({
                token: new_refresh_token,
                user_id: new mongodb_1.ObjectId(user_id),
                iat: decode_new_refresh_token.iat,
                exp: decode_new_refresh_token.exp
            }));
            return {
                access_token: new_access_token,
                refresh_token: new_refresh_token
            };
        });
    }
    getMe(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user_id) }, {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0
                }
            });
            return user;
        });
    }
    getAllUsers({ page, limit, search }) {
        return __awaiter(this, void 0, void 0, function* () {
            // $text for name and regex for email
            const users = yield database_services_1.default.users
                .find(Object.assign(Object.assign({}, (search && {
                $or: [
                    {
                        $text: {
                            $search: search
                        }
                    },
                    {
                        email: {
                            $regex: search,
                            $options: 'i'
                        }
                    }
                ]
            })), { role: {
                    $ne: enums_1.UserRole.Admin
                } }))
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray();
            return users;
        });
    }
    updateAvatar(user_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Xoá avatar cũ
            const user = yield database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user_id) });
            const avatar = user && user.avatar;
            if (avatar) {
                const avatar_path = path_1.default.resolve(dir_1.UPLOAD_IMAGE_DIR, avatar);
                yield promises_1.default.unlink(avatar_path);
            }
            // Lưu avatar mới
            const [media] = yield medias_services_1.default.uploadImage({
                req,
                maxFiles: 1,
                maxFileSize: 5 * 1024 * 1024 // 5mb
            });
            const new_avatar = media.url.split('/').slice(-1)[0];
            yield database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
                $set: {
                    avatar: new_avatar
                },
                $currentDate: {
                    updated_at: true
                }
            });
            return media;
        });
    }
    updateMe(user_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_services_1.default.users.findOneAndUpdate({ _id: new mongodb_1.ObjectId(user_id) }, {
                $set: Object.assign(Object.assign({}, payload), { date_of_birth: new Date(payload.date_of_birth) }),
                $currentDate: {
                    updated_at: true
                }
            }, {
                returnDocument: 'after',
                includeResultMetadata: false,
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0
                }
            });
            return user;
        });
    }
    changePassword(user_id, new_password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
                $set: {
                    password: (0, crypto_1.hashPassword)(new_password)
                },
                $currentDate: {
                    updated_at: true
                }
            });
            return { message: messages_1.USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS };
        });
    }
    createAddress(user_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const otherAddresses = yield database_services_1.default.addresses
                .find({
                user_id: new mongodb_1.ObjectId(user_id)
            })
                .toArray();
            const result = yield database_services_1.default.addresses.insertOne(new Address_schema_1.default(Object.assign(Object.assign({}, payload), { user_id: new mongodb_1.ObjectId(user_id), default: otherAddresses.length === 0 })));
            const address = yield database_services_1.default.addresses.findOne({ _id: result.insertedId });
            return address;
        });
    }
    getAddress(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = yield database_services_1.default.addresses
                .find({
                user_id: new mongodb_1.ObjectId(user_id)
            })
                .toArray();
            return addresses;
        });
    }
    updateAddress(address_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield database_services_1.default.addresses.findOneAndUpdate({ _id: new mongodb_1.ObjectId(address_id) }, {
                $set: payload,
                $currentDate: {
                    updated_at: true
                }
            }, {
                returnDocument: 'after',
                includeResultMetadata: false
            });
            return address;
        });
    }
    deleteAddress(address_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_services_1.default.addresses.deleteOne({
                _id: new mongodb_1.ObjectId(address_id)
            });
            return { message: messages_1.USERS_MESSAGES.DELETE_ADDRESS_SUCCESS };
        });
    }
}
const userService = new UserService();
exports.default = userService;
