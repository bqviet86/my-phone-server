import { ObjectId } from 'mongodb'

interface CartType {
    _id?: ObjectId
    user_id: ObjectId
    product_id: ObjectId
    option_id: ObjectId
    quantity: number
    created_at?: Date
    updated_at?: Date
}

export default class Cart {
    _id?: ObjectId
    user_id: ObjectId
    product_id: ObjectId
    option_id: ObjectId
    quantity: number
    created_at: Date
    updated_at: Date

    constructor(cart: CartType) {
        const date = new Date()

        this._id = cart._id
        this.user_id = cart.user_id
        this.product_id = cart.product_id
        this.option_id = cart.option_id
        this.quantity = cart.quantity
        this.created_at = cart.created_at || date
        this.updated_at = cart.updated_at || date
    }
}
