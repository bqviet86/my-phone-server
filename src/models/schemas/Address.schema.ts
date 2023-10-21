import { ObjectId } from 'mongodb'

interface AddressType {
    _id?: ObjectId
    user_id: ObjectId
    name: string
    phone_number: string
    email: string
    // province: string
    // district: string
    // ward: string
    specific_address: string
    default?: boolean
    created_at?: Date
    updated_at?: Date
}

export default class Address {
    _id?: ObjectId
    user_id: ObjectId
    name: string
    phone_number: string
    email: string
    // province: string
    // district: string
    // ward: string
    specific_address: string
    default: boolean
    created_at: Date
    updated_at: Date

    constructor(address: AddressType) {
        const date = new Date()

        this._id = address._id
        this.user_id = address.user_id
        this.name = address.name
        this.phone_number = address.phone_number
        this.email = address.email
        // this.province = address.province
        // this.district = address.district
        // this.ward = address.ward
        this.specific_address = address.specific_address
        this.default = address.default || false
        this.created_at = address.created_at || date
        this.updated_at = address.updated_at || date
    }
}
