import { Router } from 'express'

import { addToCartController, getCartController } from '~/controllers/carts.controllers'
import { addToCartValidator, isPhoneOptionIdMatched } from '~/middlewares/carts.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
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
 * Description: Get cart
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
cartsRouter.get('/', accessTokenValidator, wrapRequestHandler(getCartController))

export default cartsRouter
