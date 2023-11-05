import { Router } from 'express'

import {
    confirmPaymentController,
    createOrderController,
    getAllOrdersController,
    getOrderController,
    orderSuccessController,
    updateOrderController,
    updateOrderStatusController
} from '~/controllers/orders.controllers'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import {
    createOrderValidator,
    getAllOrdersValidator,
    getOrderValidator,
    isAllowedToUpdateOrder,
    updateOrderStatusValidator,
    updateOrderValidator
} from '~/middlewares/orders.middlewares'
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

/**
 * Description: Get order
 * Path: /:order_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: GetOrderReqParams
 */
ordersRouter.get('/:order_id', accessTokenValidator, getOrderValidator, wrapRequestHandler(getOrderController))

/**
 * Description: Get all orders
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: {
 *     order_status: OrderStatus
 * }
 */
ordersRouter.get('/', accessTokenValidator, getAllOrdersValidator, wrapRequestHandler(getAllOrdersController))

/**
 * Description: Update order
 * Path: /:order_id/:payment_method
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdateOrderReqParams
 * Body: UpdateOrderReqBody
 */
ordersRouter.put(
    '/:order_id/:payment_method',
    accessTokenValidator,
    updateOrderValidator,
    isAllowedToUpdateOrder,
    wrapRequestHandler(updateOrderController)
)

/**
 * Description: Confirm payment
 * Path: /confirm-payment/:order_id/:payment_method
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdateOrderReqParams
 * Body: UpdateOrderReqBody
 */
ordersRouter.put(
    '/confirm-payment/:order_id/:payment_method',
    accessTokenValidator,
    updateOrderValidator,
    isAllowedToUpdateOrder,
    wrapRequestHandler(confirmPaymentController)
)

/**
 * Description: Update order status
 * Path: /:order_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdateOrderStatusReqParams
 * Body: UpdateOrderStatusReqBody
 */
ordersRouter.patch(
    '/:order_id',
    accessTokenValidator,
    isAdminValidator,
    updateOrderStatusValidator,
    isAllowedToUpdateOrder,
    wrapRequestHandler(updateOrderStatusController)
)

export default ordersRouter
