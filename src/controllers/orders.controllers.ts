import { Request, Response } from 'express'
import { Query } from 'express-serve-static-core'

import { ORDERS_MESSAGES } from '~/constants/messages'
import { CreateOrderReqBody, CreateOrderReqParams } from '~/models/requests/Order.request'
import { TokenPayload } from '~/models/requests/User.requests'
import Cart from '~/models/schemas/Cart.schema'
import orderService from '~/services/orders.services'

export const createOrderController = async (
    req: Request<CreateOrderReqParams, any, CreateOrderReqBody>,
    res: Response
) => {
    const { payment_method } = req.params
    const { user_id } = req.decoded_authorization as TokenPayload
    const carts = req.carts as Cart[]

    const result = await orderService.createOrder({
        req,
        user_id,
        carts,
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
