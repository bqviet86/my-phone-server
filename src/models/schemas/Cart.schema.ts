import { ObjectId } from 'mongodb'

import { CartStatus } from '~/constants/enums'

interface CartType {
    _id?: ObjectId
    user_id: ObjectId
    phone_id: ObjectId
    phone_option_id: ObjectId
    quantity: number
    total_price: number
    cart_status?: CartStatus
    created_at?: Date
    updated_at?: Date
}

export default class Cart {
    _id?: ObjectId
    user_id: ObjectId
    phone_id: ObjectId
    phone_option_id: ObjectId
    quantity: number
    total_price: number
    cart_status: CartStatus
    created_at: Date
    updated_at: Date

    constructor(cart: CartType) {
        const date = new Date()

        this._id = cart._id
        this.user_id = cart.user_id
        this.phone_id = cart.phone_id
        this.phone_option_id = cart.phone_option_id
        this.quantity = cart.quantity
        this.total_price = cart.total_price
        this.cart_status = cart.cart_status || CartStatus.Pending
        this.created_at = cart.created_at || date
        this.updated_at = cart.updated_at || date
    }
}
