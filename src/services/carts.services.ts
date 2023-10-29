import { ObjectId } from 'mongodb'

import { CartStatus } from '~/constants/enums'
import { CARTS_MESSAGES } from '~/constants/messages'
import { AddToCartReqBody, UpdateCartReqBody } from '~/models/requests/Cart.request'
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
        // Kiểm tra xem sản phẩm có option này với trạng thái là Pending có tồn tại trong giỏ hàng không
        const isExist = await databaseService.carts.findOne({
            user_id: new ObjectId(user_id),
            phone_id: new ObjectId(payload.phone_id),
            phone_option_id: new ObjectId(payload.phone_option_id),
            cart_status: CartStatus.Pending
        })

        if (isExist) {
            // Cập nhật lại số lượng và tổng tiền
            const cart = await databaseService.carts.findOneAndUpdate(
                {
                    _id: isExist._id
                },
                {
                    $set: {
                        quantity: isExist.quantity + payload.quantity,
                        total_price: phone_option.price * (isExist.quantity + payload.quantity)
                    },
                    $currentDate: {
                        updated_at: true
                    }
                },
                {
                    returnDocument: 'after',
                    includeResultMetadata: false
                }
            )

            return cart
        } else {
            // Thêm mới vào giỏ hàng
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

    async updateCart({
        user_id,
        cart_id,
        phone_option,
        payload
    }: {
        user_id: string
        cart_id: string
        phone_option: PhoneOption
        payload: UpdateCartReqBody
    }) {
        const result = await databaseService.carts.findOneAndUpdate(
            {
                _id: new ObjectId(cart_id),
                user_id: new ObjectId(user_id)
            },
            {
                $set: {
                    ...payload,
                    phone_option_id: new ObjectId(payload.phone_option_id),
                    total_price: phone_option.price * payload.quantity
                },
                $currentDate: {
                    updated_at: true
                }
            },
            {
                returnDocument: 'after',
                includeResultMetadata: false
            }
        )

        return result
    }

    async deleteCart(user_id: string, cart_id: string) {
        await databaseService.carts.deleteOne({
            _id: new ObjectId(cart_id),
            user_id: new ObjectId(user_id)
        })

        return { message: CARTS_MESSAGES.DELETE_CART_SUCCESSFULLY }
    }
}

const cartService = new CartService()

export default cartService
