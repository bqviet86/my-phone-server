"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const common_middlewares_1 = require("../middlewares/common.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const usersRouter = (0, express_1.Router)();
/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: {
 *    name: string,
 *    email: string,
 *    password: string,
 *    confirm_password: string,
 *    date_of_birth: ISO8601,
 *    sex: Sex,
 *    phone_number: string
 * }
 */
usersRouter.post('/register', users_middlewares_1.registerValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.registerController));
/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRouter.post('/login', users_middlewares_1.loginValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.loginController));
/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', users_middlewares_1.accessTokenValidator, users_middlewares_1.refreshTokenValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.logoutController));
/**
 * Description: Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', users_middlewares_1.emailVerifyTokenValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.verifyEmailController));
/**
 * Description: User want receive email verify again
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.post('/resend-verify-email', users_middlewares_1.accessTokenValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.resendVerifyEmailController));
/**
 * Description: Submit email to reset password, then send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', users_middlewares_1.forgotPasswordValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.forgotPasswordController));
/**
 * Description: Verify forgot password token when user click on the link in email
 * Path: /verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post('/verify-forgot-password', users_middlewares_1.verifyForgotPasswordTokenValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.verifyForgotPasswordController));
/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: { forgot_password_token: string, password: string, confirm_password: string }
 */
usersRouter.post('/reset-password', users_middlewares_1.resetPasswordValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.resetPasswordController));
/**
 * Description: Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string }
 */
usersRouter.post('/refresh-token', users_middlewares_1.refreshTokenValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.refreshTokenController));
/**
 * Description: Get my info
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', users_middlewares_1.accessTokenValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.getMeController));
/**
 * Description: Get all users
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { page: number, limit: number, search: string }
 */
usersRouter.get('/', users_middlewares_1.accessTokenValidator, users_middlewares_1.isAdminValidator, common_middlewares_1.paginationValidator, users_middlewares_1.getAllUsersValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.getAllUsersController));
/**
 * Description: Update my avatar
 * Path: /avatar
 * Method: PATCH
 * Body: { image: max 1 file }
 */
usersRouter.patch('/avatar', users_middlewares_1.accessTokenValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.updateAvatarController));
/**
 * Description: Update my info
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateMeReqBody
 */
usersRouter.patch('/me', users_middlewares_1.accessTokenValidator, users_middlewares_1.updateMeValidator, (0, common_middlewares_1.filterMiddleware)(['name', 'email', 'date_of_birth', 'sex', 'phone_number']), (0, handlers_1.wrapRequestHandler)(users_controllers_1.updateMeController));
/**
 * Description: Change password
 * Path: /change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { old_password: string, password: string, confirm_password: string }
 */
usersRouter.put('/change-password', users_middlewares_1.accessTokenValidator, users_middlewares_1.changePasswordValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.changePasswordController));
/**
 * Description: Create my address
 * Path: /address
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateAddressReqBody
 */
usersRouter.post('/address', users_middlewares_1.accessTokenValidator, users_middlewares_1.createAddressValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.createAddressController));
/**
 * Description: Get my address
 * Path: /address
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/address', users_middlewares_1.accessTokenValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.getAddressController));
/**
 * Description: Update my address
 * Path: /address/:address_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { address_id: string }
 * Body: UpdateAddressReqBody
 */
usersRouter.patch('/address/:address_id', users_middlewares_1.accessTokenValidator, users_middlewares_1.updateAddressValidator, (0, common_middlewares_1.filterMiddleware)(['name', 'phone_number', 'email', 'specific_address']), (0, handlers_1.wrapRequestHandler)(users_controllers_1.updateAddressController));
/**
 * Description: Delete my address
 * Path: /address/:address_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: { address_id: string }
 */
usersRouter.delete('/address/:address_id', users_middlewares_1.accessTokenValidator, users_middlewares_1.deleteAddressValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.deleteAddressController));
// Admin routes
/**
 * Description: Login admin
 * Path: /admin/login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRouter.post('/admin/login', users_middlewares_1.loginValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.loginAdminController));
/**
 * Description: Logout admin
 * Path: /admin/logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/admin/logout', users_middlewares_1.accessTokenValidator, users_middlewares_1.refreshTokenValidator, users_middlewares_1.isAdminValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.logoutAdminController));
/**
 * Description: Submit email to reset password, then send email to admin
 * Path: /admin/forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/admin/forgot-password', users_middlewares_1.forgotPasswordValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.forgotPasswordAdminController));
/**
 * Description: Verify forgot password token when admin click on the link in email
 * Path: /admin/verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post('/admin/verify-forgot-password', users_middlewares_1.verifyForgotPasswordTokenValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.verifyForgotPasswordAdminController));
/**
 * Description: Reset password of admin
 * Path: /admin/reset-password
 * Method: POST
 * Body: { forgot_password_token: string, password: string, confirm_password: string }
 */
usersRouter.post('/admin/reset-password', users_middlewares_1.resetPasswordValidator, (0, handlers_1.wrapRequestHandler)(users_controllers_1.resetPasswordAdminController));
exports.default = usersRouter;
