import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

import HTTP_STATUS from '~/constants/httpStatus'
import { CARTS_MESSAGES } from '~/constants/messages'
import { AddToCartReqBody } from '~/models/requests/Cart.request'
import { TokenPayload } from '~/models/requests/User.requests'
import Phone from '~/models/schemas/Phone.schema'
import PhoneOption from '~/models/schemas/PhoneOption.schema'
import cartService from '~/services/carts.services'

export const addToCartController = async (req: Request<ParamsDictionary, any, AddToCartReqBody>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const phone = req.phone as Phone
    const { phone_option_id } = req.body

    // Check if phone_option_id is in phone.options
    let phone_option_matched: PhoneOption | null = null

    for (const option of phone.options as unknown as PhoneOption[]) {
        if ((option._id as ObjectId).equals(phone_option_id)) {
            phone_option_matched = option
            break
        }
    }

    if (phone_option_matched === null) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: CARTS_MESSAGES.INVALID_PHONE_OPTION_ID
        })
    }

    const result = await cartService.createCart({
        user_id,
        phone_option: phone_option_matched,
        payload: req.body
    })

    return res.json({
        message: CARTS_MESSAGES.ADD_TO_CART_SUCCESSFULLY,
        result
    })
}
