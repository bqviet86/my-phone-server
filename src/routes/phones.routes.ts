import { Router } from 'express'

import {
    createPhoneController,
    createPhoneOptionController,
    deletePhoneController,
    deletePhoneOptionController,
    getPhoneController,
    updatePhoneController,
    updatePhoneOptionController
} from '~/controllers/phones.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { accessTokenValidator, isAdminValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdatePhoneOptionReqBody } from '~/models/requests/Phone.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const phonesRouter = Router()

/**
 * Description: Create a new phone option
 * Path: /options
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreatePhoneOptionReqBody
 */
phonesRouter.post('/options', accessTokenValidator, isAdminValidator, wrapRequestHandler(createPhoneOptionController))

/**
 * Description: Update a phone option
 * Path: /options/:phone_option_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdatePhoneOptionReqParams
 * Body: UpdatePhoneOptionReqBody
 */
phonesRouter.patch(
    '/options/:phone_option_id',
    accessTokenValidator,
    isAdminValidator,
    filterMiddleware<UpdatePhoneOptionReqBody>([
        'color',
        'capacity',
        'price',
        'price_before_discount',
        'quantity',
        'images'
    ]),
    wrapRequestHandler(updatePhoneOptionController)
)

/**
 * Description: Delete a phone option
 * Path: /options/:phone_option_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: DeletePhoneOptionReqParams
 */
phonesRouter.delete(
    '/options/:phone_option_id',
    accessTokenValidator,
    isAdminValidator,
    wrapRequestHandler(deletePhoneOptionController)
)

/**
 * Description: Create a new phone
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreatePhoneReqBody
 */
phonesRouter.post('/', accessTokenValidator, isAdminValidator, wrapRequestHandler(createPhoneController))

/**
 * Description: Get a phone
 * Path: /:phone_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: GetPhoneReqParams
 */
phonesRouter.get('/:phone_id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getPhoneController))

/**
 * Description: Update a phone
 * Path: /:phone_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdatePhoneReqParams
 * Body: UpdatePhoneReqBody
 */
phonesRouter.patch('/:phone_id', accessTokenValidator, isAdminValidator, wrapRequestHandler(updatePhoneController))

/**
 * Description: Delete a phone
 * Path: /:phone_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: DeletePhoneReqParams
 */
phonesRouter.delete('/:phone_id', accessTokenValidator, isAdminValidator, wrapRequestHandler(deletePhoneController))

export default phonesRouter
