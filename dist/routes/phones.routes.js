"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const phones_controllers_1 = require("../controllers/phones.controllers");
const common_middlewares_1 = require("../middlewares/common.middlewares");
const phones_middlewares_1 = require("../middlewares/phones.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const phonesRouter = (0, express_1.Router)();
/**
 * Description: Create a new phone option
 * Path: /options
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreatePhoneOptionReqBody
 */
phonesRouter.post('/options', users_middlewares_1.accessTokenValidator, users_middlewares_1.isAdminValidator, phones_middlewares_1.createPhoneOptionValidator, (0, handlers_1.wrapRequestHandler)(phones_controllers_1.createPhoneOptionController));
/**
 * Description: Update a phone option
 * Path: /options/:phone_option_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdatePhoneOptionReqParams
 * Body: UpdatePhoneOptionReqBody
 */
phonesRouter.patch('/options/:phone_option_id', users_middlewares_1.accessTokenValidator, users_middlewares_1.isAdminValidator, phones_middlewares_1.updatePhoneOptionValidator, (0, common_middlewares_1.filterMiddleware)([
    'color',
    'capacity',
    'price',
    'price_before_discount',
    'quantity',
    'images'
]), (0, handlers_1.wrapRequestHandler)(phones_controllers_1.updatePhoneOptionController));
/**
 * Description: Delete a phone option
 * Path: /options/:phone_option_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: DeletePhoneOptionReqParams
 */
phonesRouter.delete('/options/:phone_option_id', users_middlewares_1.accessTokenValidator, users_middlewares_1.isAdminValidator, phones_middlewares_1.deletePhoneOptionValidator, (0, handlers_1.wrapRequestHandler)(phones_controllers_1.deletePhoneOptionController));
/**
 * Description: Create a new phone
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreatePhoneReqBody
 */
phonesRouter.post('/', users_middlewares_1.accessTokenValidator, users_middlewares_1.isAdminValidator, phones_middlewares_1.createPhoneValidator, (0, handlers_1.wrapRequestHandler)(phones_controllers_1.createPhoneController));
/**
 * Description: Get a phone
 * Path: /:phone_id
 * Method: GET
 * Params: GetPhoneReqParams
 */
phonesRouter.get('/:phone_id', phones_middlewares_1.getPhoneValidator, (0, handlers_1.wrapRequestHandler)(phones_controllers_1.getPhoneController));
/**
 * Description: Get all phones
 * Path: /
 * Method: GET
 * Query: {
 *     page: '1',
 *     limit: '10',
 *     brands: '_id1|_id2|_id3' or ''
 * }
 */
phonesRouter.get('/', common_middlewares_1.paginationValidator, phones_middlewares_1.getAllPhonesValidator, (0, handlers_1.wrapRequestHandler)(phones_controllers_1.getAllPhonesController));
/**
 * Description: Update a phone
 * Path: /:phone_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdatePhoneReqParams
 * Body: UpdatePhoneReqBody
 */
phonesRouter.patch('/:phone_id', users_middlewares_1.accessTokenValidator, users_middlewares_1.isAdminValidator, phones_middlewares_1.updatePhoneValidator, (0, common_middlewares_1.filterMiddleware)([
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
]), (0, handlers_1.wrapRequestHandler)(phones_controllers_1.updatePhoneController));
/**
 * Description: Delete a phone
 * Path: /:phone_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: DeletePhoneReqParams
 */
phonesRouter.delete('/:phone_id', users_middlewares_1.accessTokenValidator, users_middlewares_1.isAdminValidator, phones_middlewares_1.deletePhoneValidator, (0, handlers_1.wrapRequestHandler)(phones_controllers_1.deletePhoneController));
exports.default = phonesRouter;
