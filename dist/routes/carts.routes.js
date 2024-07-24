"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carts_controllers_1 = require("../controllers/carts.controllers");
const carts_middlewares_1 = require("../middlewares/carts.middlewares");
const common_middlewares_1 = require("../middlewares/common.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const cartsRouter = (0, express_1.Router)();
/**
 * Description: Add a product to cart
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: AddToCartReqBody
 */
cartsRouter.post('/', users_middlewares_1.accessTokenValidator, carts_middlewares_1.addToCartValidator, carts_middlewares_1.isPhoneOptionIdMatched, (0, handlers_1.wrapRequestHandler)(carts_controllers_1.addToCartController));
/**
 * Description: Get carts
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: {
 *     carts: '_id1|_id2|_id3' or ''
 * }
 */
cartsRouter.get('/', users_middlewares_1.accessTokenValidator, carts_middlewares_1.getCartValidator, (0, handlers_1.wrapRequestHandler)(carts_controllers_1.getCartController));
/**
 * Description: Update cart
 * Path: /:cart_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: cart_id
 * Body: UpdateCartReqBody
 */
cartsRouter.patch('/:cart_id', users_middlewares_1.accessTokenValidator, carts_middlewares_1.updateCartValidator, carts_middlewares_1.isPhoneOptionIdMatched, (0, common_middlewares_1.filterMiddleware)(['phone_option_id', 'quantity']), (0, handlers_1.wrapRequestHandler)(carts_controllers_1.updateCartController));
/**
 * Description: Delete cart
 * Path: /:cart_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: cart_id
 */
cartsRouter.delete('/:cart_id', users_middlewares_1.accessTokenValidator, carts_middlewares_1.deleteCartValidator, (0, handlers_1.wrapRequestHandler)(carts_controllers_1.deleteCartController));
exports.default = cartsRouter;
