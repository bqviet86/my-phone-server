import { Request, Response } from 'express'
import { ParamsDictionary, Query } from 'express-serve-static-core'

import { ORDERS_MESSAGES } from '~/constants/messages'
import { DeliveryAddress } from '~/models/Others'
import {
    ConfirmPaymentReqBody,
    ConfirmPaymentReqParams,
    CreateOrderReqBody,
    CreateOrderReqParams,
    GetAllOrderReqQuery,
    UpdateOrderReqBody,
    UpdateOrderReqParams,
    UpdateOrderStatusReqBody,
    UpdateOrderStatusReqParams
} from '~/models/requests/Order.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import Cart from '~/models/schemas/Cart.schema'
import Order from '~/models/schemas/Orders.schema'
import orderService from '~/services/orders.services'

export const createOrderController = async (
    req: Request<CreateOrderReqParams, any, CreateOrderReqBody>,
    res: Response
) => {
    const { payment_method } = req.params
    const { user_id } = req.decoded_authorization as TokenPayload
    const carts = req.carts as Cart[]
    const delivery_address = req.delivery_address as DeliveryAddress

    const result = await orderService.createOrder({
        req,
        user_id,
        carts,
        delivery_address,
        payment_method: Number(payment_method),
        payload: req.body
    })

    res.json({
        message: ORDERS_MESSAGES.CREATE_ORDER_SUCCESSFULLY,
        result
    })
}

export const orderSuccessController = async (req: Request, res: Response) => {
    const result = await orderService.orderSuccess(req.query as Query)

    return res.json({
        message: result.success ? ORDERS_MESSAGES.ORDER_SUCCESS : ORDERS_MESSAGES.ORDER_FAIL,
        result
    })
}

export const getOrderController = async (req: Request, res: Response) => {
    const order = req.order as Order

    res.json({
        message: ORDERS_MESSAGES.GET_ORDER_SUCCESSFULLY,
        result: order
    })
}

export const getAllOrdersController = async (
    req: Request<ParamsDictionary, any, any, GetAllOrderReqQuery>,
    res: Response
) => {
    const { order_status } = req.query
    const { user_id, role } = req.decoded_authorization as TokenPayload
    const result = await orderService.getAllOrders({ user_id, role, order_status })

    res.json({
        message: ORDERS_MESSAGES.GET_ALL_ORDERS_SUCCESSFULLY,
        result
    })
}

export const updateOrderController = async (
    req: Request<UpdateOrderReqParams, any, UpdateOrderReqBody>,
    res: Response
) => {
    const { order_id, payment_method } = req.params
    const carts = req.carts as Cart[]
    const delivery_address = req.delivery_address as DeliveryAddress

    const result = await orderService.updateOrder({
        order_id,
        carts,
        delivery_address,
        payment_method: Number(payment_method),
        payload: req.body
    })

    res.json({
        message: ORDERS_MESSAGES.UPDATE_ORDER_SUCCESSFULLY,
        result
    })
}

export const confirmPaymentController = async (
    req: Request<ConfirmPaymentReqParams, any, ConfirmPaymentReqBody>,
    res: Response
) => {
    const { order_id, payment_method } = req.params
    const carts = req.carts as Cart[]
    const delivery_address = req.delivery_address

    const result = await orderService.confirmPayment({
        req,
        order_id,
        carts,
        delivery_address,
        payment_method: Number(payment_method),
        payload: req.body
    })

    res.json({
        message: ORDERS_MESSAGES.CONFIRM_PAYMENT_SUCCESSFULLY,
        result
    })
}

export const updateOrderStatusController = async (
    req: Request<UpdateOrderStatusReqParams, any, UpdateOrderStatusReqBody>,
    res: Response
) => {
    const { order_id } = req.params
    const { order_status } = req.body

    const result = await orderService.updateOrderStatus({
        order_id,
        order_status: Number(order_status)
    })

    res.json({
        message: ORDERS_MESSAGES.UPDATE_ORDER_STATUS_SUCCESSFULLY,
        result
    })
}
