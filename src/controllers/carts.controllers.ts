import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { CARTS_MESSAGES } from '~/constants/messages'
import { AddToCartReqBody } from '~/models/requests/Cart.request'
import { TokenPayload } from '~/models/requests/User.requests'
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
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await cartService.getCart(user_id)

    return res.json({
        message: CARTS_MESSAGES.GET_CART_SUCCESSFULLY,
        result
    })
}
