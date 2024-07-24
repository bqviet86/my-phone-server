"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controllers_1 = require("../controllers/orders.controllers");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const orders_middlewares_1 = require("../middlewares/orders.middlewares");
const handlers_1 = require("../utils/handlers");
const ordersRouter = (0, express_1.Router)();
/**
 * Description: Create order
 * Path: /:payment_method (/0 => CreditCard, /1 => Cash)
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateOrderReqBody
 * Params: CreateOrderReqParams
 */
ordersRouter.post('/:payment_method', users_middlewares_1.accessTokenValidator, orders_middlewares_1.createOrderValidator, (0, handlers_1.wrapRequestHandler)(orders_controllers_1.createOrderController));
/**
 * Description: Order success
 * Path: /success
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Query: VNPAY query parameters
 */
ordersRouter.patch('/success', users_middlewares_1.accessTokenValidator, (0, handlers_1.wrapRequestHandler)(orders_controllers_1.orderSuccessController));
/**
 * Description: Get order
 * Path: /:order_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: GetOrderReqParams
 */
ordersRouter.get('/:order_id', users_middlewares_1.accessTokenValidator, orders_middlewares_1.getOrderValidator, (0, handlers_1.wrapRequestHandler)(orders_controllers_1.getOrderController));
/**
 * Description: Get all orders
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: {
 *     order_status: OrderStatus
 * }
 */
ordersRouter.get('/', users_middlewares_1.accessTokenValidator, orders_middlewares_1.getAllOrdersValidator, (0, handlers_1.wrapRequestHandler)(orders_controllers_1.getAllOrdersController));
/**
 * Description: Update order
 * Path: /:order_id/:payment_method
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdateOrderReqParams
 * Body: UpdateOrderReqBody
 */
ordersRouter.put('/:order_id/:payment_method', users_middlewares_1.accessTokenValidator, orders_middlewares_1.updateOrderValidator, orders_middlewares_1.isAllowedToUpdateOrder, (0, handlers_1.wrapRequestHandler)(orders_controllers_1.updateOrderController));
/**
 * Description: Confirm payment
 * Path: /confirm-payment/:order_id/:payment_method
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Params: ConfirmPaymentReqParams
 * Body: ConfirmPaymentReqBody
 */
ordersRouter.put('/confirm-payment/:order_id/:payment_method', users_middlewares_1.accessTokenValidator, orders_middlewares_1.confirmPaymentValidator, orders_middlewares_1.isAllowedToUpdateOrder, (0, handlers_1.wrapRequestHandler)(orders_controllers_1.confirmPaymentController));
/**
 * Description: Update order status
 * Path: /:order_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: UpdateOrderStatusReqParams
 * Body: UpdateOrderStatusReqBody
 */
ordersRouter.patch('/:order_id', users_middlewares_1.accessTokenValidator, orders_middlewares_1.updateOrderStatusValidator, orders_middlewares_1.isAllowedToUpdateOrder, (0, handlers_1.wrapRequestHandler)(orders_controllers_1.updateOrderStatusController));
exports.default = ordersRouter;
