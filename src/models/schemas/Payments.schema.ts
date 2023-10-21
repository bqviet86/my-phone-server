import { ObjectId } from 'mongodb'

import { PaymentMethod } from '~/constants/enums'
import { CreditCardInfo } from '../Others'

interface PaymentType {
    _id?: ObjectId
    order_id: ObjectId
    payment_method: PaymentMethod
    credit_card_info?: CreditCardInfo
    created_at?: Date
    updated_at?: Date
}

export default class Payment {
    _id?: ObjectId
    order_id: ObjectId
    payment_method: PaymentMethod
    credit_card_info: CreditCardInfo | null
    created_at: Date
    updated_at: Date

    constructor(payment: PaymentType) {
        const date = new Date()

        this._id = payment._id
        this.order_id = payment.order_id
        this.payment_method = payment.payment_method
        this.credit_card_info = payment.credit_card_info || null
        this.created_at = payment.created_at || date
        this.updated_at = payment.updated_at || date
    }
}
