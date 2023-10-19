import { ObjectId } from 'mongodb'

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
        // Kiểm tra xem sản phẩm với option này đã có trong giỏ hàng chưa
        const isExist = await databaseService.carts.findOne({
            user_id: new ObjectId(user_id),
            phone_id: new ObjectId(payload.phone_id),
            phone_option_id: new ObjectId(payload.phone_option_id)
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

    async getCart(user_id: string) {
        // Trả về danh sách sản phẩm trong giỏ hàng của user được sắp xếp theo thời gian cập nhật sao cho sản phẩm mới nhất được hiển thị đầu tiên
        const carts = await databaseService.carts
            .aggregate<Cart>([
                {
                    $match: {
                        user_id: new ObjectId(user_id)
                    }
                },
                {
                    $lookup: {
                        from: 'phones',
                        localField: 'phone_id',
                        foreignField: '_id',
                        as: 'phone'
                    }
                },
                {
                    $lookup: {
                        from: 'phone_options',
                        localField: 'phone_option_id',
                        foreignField: '_id',
                        as: 'phone_option'
                    }
                },
                {
                    $unwind: '$phone'
                },
                {
                    $unwind: '$phone_option'
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'phone.brand',
                        foreignField: '_id',
                        as: 'phone.brand'
                    }
                },
                {
                    $lookup: {
                        from: 'phone_options',
                        localField: 'phone.options',
                        foreignField: '_id',
                        as: 'phone.options'
                    }
                },
                {
                    $unwind: '$phone.brand'
                },
                {
                    $project: {
                        _id: 1,
                        phone: {
                            _id: 1,
                            name: 1,
                            brand: 1,
                            options: 1
                        },
                        phone_option: {
                            _id: 1,
                            color: 1,
                            capacity: 1,
                            price: 1,
                            price_before_discount: 1,
                            images: 1
                        },
                        quantity: 1,
                        total_price: 1,
                        created_at: 1,
                        updated_at: 1
                    }
                },
                {
                    $sort: {
                        updated_at: -1
                    }
                }
            ])
            .toArray()

        return carts
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
