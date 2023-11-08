import { ObjectId } from 'mongodb'

interface InvoiceType {
    _id?: ObjectId
    order_id: ObjectId
    created_at?: Date
    updated_at?: Date
}

export default class Invoice {
    _id?: ObjectId
    order_id: ObjectId
    created_at: Date
    updated_at: Date

    constructor(invoice: InvoiceType) {
        const date = new Date()

        this._id = invoice._id
        this.order_id = invoice.order_id
        this.created_at = invoice.created_at || date
        this.updated_at = invoice.updated_at || date
    }
}
