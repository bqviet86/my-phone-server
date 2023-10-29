import { ObjectId } from 'mongodb'

import { OrderStatus } from '~/constants/enums'

interface OrderType {
    _id?: ObjectId
    user_id: ObjectId
    carts: ObjectId[]
    address: ObjectId
    content: string
    order_status: OrderStatus
    created_at?: Date
    updated_at?: Date
}

export default class Order {
    _id?: ObjectId
    user_id: ObjectId
    carts: ObjectId[]
    address: ObjectId
    content: string
    order_status: OrderStatus
    created_at: Date
    updated_at: Date

    constructor(order: OrderType) {
        const date = new Date()

        this._id = order._id
        this.user_id = order.user_id
        this.carts = order.carts
        this.address = order.address
        this.content = order.content
        this.order_status = order.order_status
        this.created_at = order.created_at || date
        this.updated_at = order.updated_at || date
    }
}
