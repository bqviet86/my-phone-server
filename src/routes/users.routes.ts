import { Router } from 'express'

import {
    changePasswordController,
    createAddressController,
    deleteAddressController,
    forgotPasswordAdminController,
    forgotPasswordController,
    getAddressController,
    getMeController,
    loginAdminController,
    loginController,
    logoutAdminController,
    logoutController,
    refreshTokenController,
    registerController,
    resendVerifyEmailController,
    resetPasswordAdminController,
    resetPasswordController,
    updateAddressController,
    updateAvatarController,
    updateMeController,
    verifyEmailController,
    verifyForgotPasswordAdminController,
    verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
    accessTokenValidator,
    changePasswordValidator,
    createAddressValidator,
    deleteAddressValidator,
    emailVerifyTokenValidator,
    forgotPasswordValidator,
    isAdminValidator,
    loginValidator,
    refreshTokenValidator,
    registerValidator,
    resetPasswordValidator,
    updateAddressValidator,
    updateMeValidator,
    verifiedUserValidator,
    verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateAddressReqBody, UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

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
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: User want receive email verify again
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: Submit email to reset password, then send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Verify forgot password token when user click on the link in email
 * Path: /verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
    '/verify-forgot-password',
    verifyForgotPasswordTokenValidator,
    wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: { forgot_password_token: string, password: string, confirm_password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string }
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description: Get my info
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update my avatar
 * Path: /avatar
 * Method: PATCH
 * Body: { image: max 1 file }
 */
usersRouter.patch('/avatar', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(updateAvatarController))

/**
 * Description: Update my info
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateMeReqBody
 */
usersRouter.patch(
    '/me',
    accessTokenValidator,
    verifiedUserValidator,
    updateMeValidator,
    filterMiddleware<UpdateMeReqBody>(['name', 'date_of_birth', 'sex', 'phone_number']),
    wrapRequestHandler(updateMeController)
)

/**
 * Description: Change password
 * Path: /change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { old_password: string, password: string, confirm_password: string }
 */
usersRouter.put(
    '/change-password',
    accessTokenValidator,
    verifiedUserValidator,
    changePasswordValidator,
    wrapRequestHandler(changePasswordController)
)

/**
 * Description: Create my address
 * Path: /address
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateAddressReqBody
 */
usersRouter.post(
    '/address',
    accessTokenValidator,
    verifiedUserValidator,
    createAddressValidator,
    wrapRequestHandler(createAddressController)
)

/**
 * Description: Get my address
 * Path: /address
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/address', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getAddressController))

/**
 * Description: Update my address
 * Path: /address/:address_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { address_id: string }
 * Body: UpdateAddressReqBody
 */
usersRouter.patch(
    '/address/:address_id',
    accessTokenValidator,
    verifiedUserValidator,
    updateAddressValidator,
    filterMiddleware<UpdateAddressReqBody>([
        'name',
        'phone_number',
        'email',
        'province',
        'district',
        'ward',
        'specific_address'
    ]),
    wrapRequestHandler(updateAddressController)
)

/**
 * Description: Delete my address
 * Path: /address/:address_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: { address_id: string }
 */
usersRouter.delete(
    '/address/:address_id',
    accessTokenValidator,
    verifiedUserValidator,
    deleteAddressValidator,
    wrapRequestHandler(deleteAddressController)
)

// Admin routes

/**
 * Description: Login admin
 * Path: /admin/login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRouter.post('/admin/login', loginValidator, wrapRequestHandler(loginAdminController))

/**
 * Description: Logout admin
 * Path: /admin/logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post(
    '/admin/logout',
    accessTokenValidator,
    refreshTokenValidator,
    isAdminValidator,
    wrapRequestHandler(logoutAdminController)
)

/**
 * Description: Submit email to reset password, then send email to admin
 * Path: /admin/forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/admin/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordAdminController))

/**
 * Description: Verify forgot password token when admin click on the link in email
 * Path: /admin/verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
    '/admin/verify-forgot-password',
    verifyForgotPasswordTokenValidator,
    wrapRequestHandler(verifyForgotPasswordAdminController)
)

/**
 * Description: Reset password of admin
 * Path: /admin/reset-password
 * Method: POST
 * Body: { forgot_password_token: string, password: string, confirm_password: string }
 */
usersRouter.post('/admin/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordAdminController))

export default usersRouter
