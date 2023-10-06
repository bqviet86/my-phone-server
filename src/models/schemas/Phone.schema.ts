import { ObjectId } from 'mongodb'

interface PhoneType {
    _id?: ObjectId
    name: string
    price: number
    price_before_discount: number
    image: string
    infor_detail: string
    description: string
    brand: ObjectId
    guarantee?: string
    screen_type: string
    resolution: string
    operating_system: string
    memory: string
    chip: string
    battery: string
    battery_technology: string
    rear_camera: string
    front_camera: string
    wifi: string
    jack_phone: string
    size: string
    weight: string
    created_at?: Date
    updated_at?: Date
}

export default class Phone {
    _id?: ObjectId
    name: string
    price: number
    price_before_discount: number
    image: string
    infor_detail: string
    description: string
    brand: ObjectId
    guarantee: string
    screen_type: string
    resolution: string
    operating_system: string
    memory: string
    chip: string
    battery: string
    battery_technology: string
    rear_camera: string
    front_camera: string
    wifi: string
    jack_phone: string
    size: string
    weight: string
    created_at: Date
    updated_at: Date

    constructor(phone: PhoneType) {
        const date = new Date()

        this._id = phone._id
        this.name = phone.name
        this.price = phone.price
        this.price_before_discount = phone.price_before_discount
        this.image = phone.image
        this.infor_detail = phone.infor_detail
        this.description = phone.description
        this.brand = phone.brand
        this.guarantee = phone.guarantee || '12 tháng'
        this.screen_type = phone.screen_type
        this.resolution = phone.resolution
        this.operating_system = phone.operating_system
        this.memory = phone.memory
        this.chip = phone.chip
        this.battery = phone.battery
        this.battery_technology = phone.battery_technology
        this.rear_camera = phone.rear_camera
        this.front_camera = phone.front_camera
        this.wifi = phone.wifi
        this.jack_phone = phone.jack_phone
        this.size = phone.size
        this.weight = phone.weight
        this.created_at = phone.created_at || date
        this.updated_at = phone.updated_at || date
    }
}
