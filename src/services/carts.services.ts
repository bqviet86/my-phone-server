import { ObjectId } from 'mongodb'

import { AddToCartReqBody } from '~/models/requests/Cart.request'
import Cart from '~/models/schemas/Cart.schema'
import PhoneOption from '~/models/schemas/PhoneOption.schema'
import databaseService from './database.services'

class CartService {
    async createCart({
        user_id,
        phone_option,
        payload
    }: {
        user_id: string
        phone_option: PhoneOption
        payload: AddToCartReqBody
    }) {
        const result = await databaseService.carts.insertOne(
            new Cart({
                ...payload,
                user_id: new ObjectId(user_id),
                phone_id: new ObjectId(payload.phone_id),
                phone_option_id: new ObjectId(payload.phone_option_id),
                total_price: phone_option.price * payload.quantity
            })
        )

        const cart = await databaseService.carts.findOne({
            _id: result.insertedId
        })

        return cart
    }
}

const cartService = new CartService()

export default cartService
