import { ObjectId } from 'mongodb'

interface PhoneOptionType {
    _id?: ObjectId
    color: string
    capacity: string
    price: number
    price_before_discount: number
    quantity: number
    images: string[]
    created_at?: Date
    updated_at?: Date
}

export default class PhoneOption {
    _id?: ObjectId
    color: string
    capacity: string
    price: number
    price_before_discount: number
    quantity: number
    images: string[]
    created_at: Date
    updated_at: Date

    constructor(phoneOption: PhoneOptionType) {
        const date = new Date()

        this._id = phoneOption._id
        this.color = phoneOption.color
        this.capacity = phoneOption.capacity
        this.price = phoneOption.price
        this.price_before_discount = phoneOption.price_before_discount
        this.quantity = phoneOption.quantity
        this.images = phoneOption.images
        this.created_at = phoneOption.created_at || date
        this.updated_at = phoneOption.updated_at || date
    }
}
