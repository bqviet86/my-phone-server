import { ObjectId } from 'mongodb'

import { PaymentMethod, PaymentStatus } from '~/constants/enums'

interface PaymentType {
    _id?: ObjectId
    order_id: ObjectId
    payment_method: PaymentMethod
    total_price: number
    bank_code?: string
    card_type?: string
    payment_status?: PaymentStatus
    created_at?: Date
    updated_at?: Date
}

export default class Payment {
    _id?: ObjectId
    order_id: ObjectId
    payment_method: PaymentMethod
    total_price: number
    bank_code: string
    card_type: string
    payment_status: PaymentStatus
    created_at: Date
    updated_at: Date

    constructor(payment: PaymentType) {
        const date = new Date()

        this._id = payment._id
        this.order_id = payment.order_id
        this.payment_method = payment.payment_method
        this.total_price = payment.total_price
        this.bank_code = payment.bank_code || ''
        this.card_type = payment.card_type || ''
        this.payment_status = payment.payment_status || PaymentStatus.PendingPayment
        this.created_at = payment.created_at || date
        this.updated_at = payment.updated_at || date
    }
}
