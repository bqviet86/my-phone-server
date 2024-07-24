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
exports.resetPasswordAdminController = exports.verifyForgotPasswordAdminController = exports.forgotPasswordAdminController = exports.logoutAdminController = exports.loginAdminController = exports.deleteAddressController = exports.updateAddressController = exports.getAddressController = exports.createAddressController = exports.changePasswordController = exports.updateMeController = exports.updateAvatarController = exports.getAllUsersController = exports.getMeController = exports.refreshTokenController = exports.resetPasswordController = exports.verifyForgotPasswordController = exports.forgotPasswordController = exports.resendVerifyEmailController = exports.verifyEmailController = exports.logoutController = exports.loginController = exports.registerController = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
const enums_1 = require("../constants/enums");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const database_services_1 = __importDefault(require("../services/database.services"));
const users_services_1 = __importDefault(require("../services/users.services"));
(0, dotenv_1.config)();
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_services_1.default.register(req.body);
    return res.json({
        message: messages_1.USERS_MESSAGES.REGISTER_SUCCESS,
        result
    });
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, verify, role } = req.user;
    const result = yield users_services_1.default.login({ user_id: _id.toString(), verify, role });
    return res.json({
        message: messages_1.USERS_MESSAGES.LOGIN_SUCCESS,
        result
    });
});
exports.loginController = loginController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh_token } = req.body;
    const result = yield users_services_1.default.logout(refresh_token);
    return res.json(result);
});
exports.logoutController = logoutController;
const verifyEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user.verify === enums_1.UserVerifyStatus.Verified) {
        return res.json({
            message: messages_1.USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
        });
    }
    const result = yield users_services_1.default.verifyEmail(user._id.toString());
    return res.json({
        message: messages_1.USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
        result
    });
});
exports.verifyEmailController = verifyEmailController;
const resendVerifyEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const user = yield database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user_id) });
    if (!user) {
        return res.status(httpStatus_1.default.NOT_FOUND).json({
            message: messages_1.USERS_MESSAGES.USER_NOT_FOUND
        });
    }
    if (user.verify === enums_1.UserVerifyStatus.Verified) {
        return res.json({
            message: messages_1.USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
        });
    }
    const result = yield users_services_1.default.resendVerifyEmail(user_id, user.email);
    return res.json(result);
});
exports.resendVerifyEmailController = resendVerifyEmailController;
const forgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, email, verify, role } = req.user;
    const result = yield users_services_1.default.forgotPassword({ user_id: _id.toString(), email, verify, role });
    return res.json(result);
});
exports.forgotPasswordController = forgotPasswordController;
const verifyForgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({
        message: messages_1.USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
    });
});
exports.verifyForgotPasswordController = verifyForgotPasswordController;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_forgot_password_token;
    const { password } = req.body;
    const result = yield users_services_1.default.resetPassword(user_id, password);
    return res.json(result);
});
exports.resetPasswordController = resetPasswordController;
const refreshTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, verify, role, exp } = req.decoded_refresh_token;
    const { refresh_token } = req.body;
    const result = yield users_services_1.default.refreshToken({ user_id, verify, role, exp, refresh_token });
    return res.json({
        message: messages_1.USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
        result
    });
});
exports.refreshTokenController = refreshTokenController;
const getMeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const result = yield users_services_1.default.getMe(user_id);
    return res.json({
        message: messages_1.USERS_MESSAGES.GET_ME_SUCCESS,
        result
    });
});
exports.getMeController = getMeController;
const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search } = req.query;
    const result = yield users_services_1.default.getAllUsers({
        page: Number(page),
        limit: Number(limit),
        search
    });
    return res.json({
        message: messages_1.USERS_MESSAGES.GET_ALL_USERS_SUCCESS,
        result
    });
});
exports.getAllUsersController = getAllUsersController;
const updateAvatarController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const result = yield users_services_1.default.updateAvatar(user_id, req);
    return res.json({
        message: messages_1.USERS_MESSAGES.UPDATE_AVATAR_SUCCESS,
        result
    });
});
exports.updateAvatarController = updateAvatarController;
const updateMeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const result = yield users_services_1.default.updateMe(user_id, req.body);
    return res.json({
        message: messages_1.USERS_MESSAGES.UPDATE_ME_SUCCESS,
        result
    });
});
exports.updateMeController = updateMeController;
const changePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const { password } = req.body;
    const result = yield users_services_1.default.changePassword(user_id, password);
    return res.json(result);
});
exports.changePasswordController = changePasswordController;
const createAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const result = yield users_services_1.default.createAddress(user_id, req.body);
    return res.json({
        message: messages_1.USERS_MESSAGES.CREATE_ADDRESS_SUCCESS,
        result
    });
});
exports.createAddressController = createAddressController;
const getAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const result = yield users_services_1.default.getAddress(user_id);
    return res.json({
        message: messages_1.USERS_MESSAGES.GET_ADDRESS_SUCCESS,
        result
    });
});
exports.getAddressController = getAddressController;
const updateAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address_id } = req.params;
    const result = yield users_services_1.default.updateAddress(address_id, req.body);
    return res.json({
        message: messages_1.USERS_MESSAGES.UPDATE_ADDRESS_SUCCESS,
        result
    });
});
exports.updateAddressController = updateAddressController;
const deleteAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address_id } = req.params;
    const result = yield users_services_1.default.deleteAddress(address_id);
    return res.json(result);
});
exports.deleteAddressController = deleteAddressController;
const loginAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, verify, role } = req.user;
    if (role !== enums_1.UserRole.Admin) {
        return res.status(httpStatus_1.default.FORBIDDEN).json({
            message: messages_1.USERS_MESSAGES.USER_NOT_ADMIN
        });
    }
    const result = yield users_services_1.default.login({ user_id: _id.toString(), verify, role });
    return res.json({
        message: messages_1.USERS_MESSAGES.LOGIN_SUCCESS,
        result
    });
});
exports.loginAdminController = loginAdminController;
const logoutAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.decoded_refresh_token;
    const { refresh_token } = req.body;
    if (role !== enums_1.UserRole.Admin) {
        return res.status(httpStatus_1.default.FORBIDDEN).json({
            message: messages_1.USERS_MESSAGES.USER_NOT_ADMIN
        });
    }
    const result = yield users_services_1.default.logout(refresh_token);
    return res.json(result);
});
exports.logoutAdminController = logoutAdminController;
const forgotPasswordAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, email, verify, role } = req.user;
    if (role !== enums_1.UserRole.Admin) {
        return res.status(httpStatus_1.default.FORBIDDEN).json({
            message: messages_1.USERS_MESSAGES.USER_NOT_ADMIN
        });
    }
    const result = yield users_services_1.default.forgotPassword({ user_id: _id.toString(), email, verify, role });
    return res.json(result);
});
exports.forgotPasswordAdminController = forgotPasswordAdminController;
const verifyForgotPasswordAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.decoded_forgot_password_token;
    if (role !== enums_1.UserRole.Admin) {
        return res.status(httpStatus_1.default.FORBIDDEN).json({
            message: messages_1.USERS_MESSAGES.USER_NOT_ADMIN
        });
    }
    return res.json({
        message: messages_1.USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
    });
});
exports.verifyForgotPasswordAdminController = verifyForgotPasswordAdminController;
const resetPasswordAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, role } = req.decoded_forgot_password_token;
    const { password } = req.body;
    if (role !== enums_1.UserRole.Admin) {
        return res.status(httpStatus_1.default.FORBIDDEN).json({
            message: messages_1.USERS_MESSAGES.USER_NOT_ADMIN
        });
    }
    const result = yield users_services_1.default.resetPassword(user_id, password);
    return res.json(result);
});
exports.resetPasswordAdminController = resetPasswordAdminController;
