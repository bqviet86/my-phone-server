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

    async getCart(user_id: string) {
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
                    $unwind: '$phone.brand'
                },
                {
                    $project: {
                        _id: 1,
                        phone: {
                            _id: 1,
                            name: 1,
                            brand: 1
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
                }
            ])
            .toArray()

        return carts
    }
}

const cartService = new CartService()

export default cartService
