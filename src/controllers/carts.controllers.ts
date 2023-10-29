import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { CARTS_MESSAGES } from '~/constants/messages'
import {
    AddToCartReqBody,
    DeleteCartReqParams,
    UpdateCartReqBody,
    UpdateCartReqParams
} from '~/models/requests/Cart.request'
import { TokenPayload } from '~/models/requests/User.requests'
import Cart from '~/models/schemas/Cart.schema'
import PhoneOption from '~/models/schemas/PhoneOption.schema'
import cartService from '~/services/carts.services'

export const addToCartController = async (req: Request<ParamsDictionary, any, AddToCartReqBody>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const phone_option = req.phone_option as PhoneOption
    const result = await cartService.createCart({
        user_id,
        phone_option: phone_option,
        payload: req.body
    })

    return res.json({
        message: CARTS_MESSAGES.ADD_TO_CART_SUCCESSFULLY,
        result
    })
}

export const getCartController = async (req: Request, res: Response) => {
    const carts = req.carts as Cart[]

    return res.json({
        message: CARTS_MESSAGES.GET_CART_SUCCESSFULLY,
        result: carts
    })
}

export const updateCartController = async (
    req: Request<UpdateCartReqParams, any, UpdateCartReqBody>,
    res: Response
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { cart_id } = req.params
    const phone_option = req.phone_option as PhoneOption
    const result = await cartService.updateCart({
        user_id,
        cart_id,
        phone_option: phone_option,
        payload: req.body
    })

    return res.json({
        message: CARTS_MESSAGES.UPDATE_CART_SUCCESSFULLY,
        result
    })
}

export const deleteCartController = async (req: Request<DeleteCartReqParams>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { cart_id } = req.params
    const result = await cartService.deleteCart(user_id, cart_id)

    return res.json(result)
}
