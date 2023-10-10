import { ObjectId } from 'mongodb'

interface PhoneType {
    _id?: ObjectId
    name: string
    price: number[]
    price_before_discount: number
    image: string
    options: string[]
    description: string
    brand: string
    screen_type: string
    resolution: string
    operating_system: string
    memory: string
    chip: string
    battery: string
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
    price: number[]
    price_before_discount: number
    image: string
    options: ObjectId[]
    description: string
    brand: ObjectId
    screen_type: string
    resolution: string
    operating_system: string
    memory: string
    chip: string
    battery: string
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
        this.options = phone.options.map((option) => new ObjectId(option))
        this.description = phone.description
        this.brand = new ObjectId(phone.brand)
        this.screen_type = phone.screen_type
        this.resolution = phone.resolution
        this.operating_system = phone.operating_system
        this.memory = phone.memory
        this.chip = phone.chip
        this.battery = phone.battery
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
