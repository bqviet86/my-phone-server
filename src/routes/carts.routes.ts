import { Router } from 'express'

import {
    addToCartController,
    deleteCartController,
    getCartController,
    updateCartController
} from '~/controllers/carts.controllers'
import {
    addToCartValidator,
    deleteCartValidator,
    getCartValidator,
    isPhoneOptionIdMatched,
    updateCartValidator
} from '~/middlewares/carts.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { UpdateCartReqBody } from '~/models/requests/Cart.request'
import { wrapRequestHandler } from '~/utils/handlers'

const cartsRouter = Router()

/**
 * Description: Add a product to cart
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: AddToCartReqBody
 */
cartsRouter.post(
    '/',
    accessTokenValidator,
    addToCartValidator,
    isPhoneOptionIdMatched,
    wrapRequestHandler(addToCartController)
)

/**
 * Description: Get carts
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: {
 *     carts: '_id1|_id2|_id3' or ''
 * }
 */
cartsRouter.get('/', accessTokenValidator, getCartValidator, wrapRequestHandler(getCartController))

/**
 * Description: Update cart
 * Path: /:cart_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: cart_id
 * Body: UpdateCartReqBody
 */
cartsRouter.patch(
    '/:cart_id',
    accessTokenValidator,
    updateCartValidator,
    isPhoneOptionIdMatched,
    filterMiddleware<UpdateCartReqBody>(['phone_option_id', 'quantity']),
    wrapRequestHandler(updateCartController)
)

/**
 * Description: Delete cart
 * Path: /:cart_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: cart_id
 */
cartsRouter.delete('/:cart_id', accessTokenValidator, deleteCartValidator, wrapRequestHandler(deleteCartController))

export default cartsRouter
