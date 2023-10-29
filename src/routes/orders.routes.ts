import { Router } from 'express'

import { createOrderController, orderSuccessController } from '~/controllers/orders.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { createOrderValidator } from '~/middlewares/orders.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const ordersRouter = Router()

/**
 * Description: Create order
 * Path: /:payment_method (/0 => CreditCard, /1 => Cash)
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateOrderReqBody
 * Params: CreateOrderReqParams
 */
ordersRouter.post(
    '/:payment_method',
    accessTokenValidator,
    createOrderValidator,
    wrapRequestHandler(createOrderController)
)

/**
 * Description: Order success
 * Path: /success
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Query: VNPAY query parameters
 */
ordersRouter.patch('/success', accessTokenValidator, wrapRequestHandler(orderSuccessController))

export default ordersRouter
