import { Router } from 'express'

import {
    createPhoneController,
    createPhoneOptionController,
    deletePhoneController,
    deletePhoneOptionController,
    getAllPhonesController,
    getPhoneController,
    updatePhoneController,
    updatePhoneOptionController
} from '~/controllers/phones.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
    createPhoneOptionValidator,
    createPhoneValidator,
    deletePhoneOptionValidator,
    deletePhoneValidator,
    getPhoneValidator,
    updatePhoneOptionValidator,
    updatePhoneValidator
} from '~/middlewares/phones.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { UpdatePhoneOptionReqBody, UpdatePhoneReqBody } from '~/models/requests/Phone.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const phonesRouter = Router()

/**
 * Description: Create a new phone option
 * Path: /options
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreatePhoneOptionReqBody
 */
phonesRouter.post(
    '/options',
    accessTokenValidator,
    isAdminValidator,
    createPhoneOptionValidator,
    wrapRequestHandler(createPhoneOptionController)
)

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
    updatePhoneOptionValidator,
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
    deletePhoneOptionValidator,
    wrapRequestHandler(deletePhoneOptionController)
)

/**
 * Description: Create a new phone
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreatePhoneReqBody
 */
phonesRouter.post(
    '/',
    accessTokenValidator,
    isAdminValidator,
    createPhoneValidator,
    wrapRequestHandler(createPhoneController)
)

/**
 * Description: Get a phone
 * Path: /:phone_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: GetPhoneReqParams
 */
phonesRouter.get('/:phone_id', getPhoneValidator, wrapRequestHandler(getPhoneController))

/**
 * Description: Get all phones
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: GetAllPhonesReqQuery
 * Body: GetAllPhonesReqBody
 */
phonesRouter.get('/', wrapRequestHandler(getAllPhonesController))

/**
 * Description: Update a phone
 * Path: /:phone_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdatePhoneReqParams
 * Body: UpdatePhoneReqBody
 */
phonesRouter.patch(
    '/:phone_id',
    accessTokenValidator,
    isAdminValidator,
    updatePhoneValidator,
    filterMiddleware<UpdatePhoneReqBody>([
        'name',
        'image',
        'options',
        'description',
        'brand',
        'screen_type',
        'resolution',
        'operating_system',
        'memory',
        'chip',
        'battery',
        'rear_camera',
        'front_camera',
        'wifi',
        'jack_phone',
        'size',
        'weight'
    ]),
    wrapRequestHandler(updatePhoneController)
)

/**
 * Description: Delete a phone
 * Path: /:phone_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: DeletePhoneReqParams
 */
phonesRouter.delete(
    '/:phone_id',
    accessTokenValidator,
    isAdminValidator,
    deletePhoneValidator,
    wrapRequestHandler(deletePhoneController)
)

export default phonesRouter
