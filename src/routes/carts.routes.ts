import { Router } from 'express'

import { addToCartController } from '~/controllers/carts.controllers'
import { addToCartValidator } from '~/middlewares/carts.middlewares'
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
cartsRouter.post('/', accessTokenValidator, addToCartValidator, wrapRequestHandler(addToCartController))

export default cartsRouter
