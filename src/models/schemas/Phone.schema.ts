import { ObjectId } from 'mongodb'

interface PhoneType {
    _id?: ObjectId
    name: string
    price: number
    price_before_discount: number
    options: ObjectId[]
    image: string
    images: string[]
    infor_detail: string
    description: string
    brand: ObjectId
    guarantee?: string
    series: string
    screen_type: string
    resolution: string
    operating_system: string
    memory: string
    chip: string
    battery: string
    battery_technology: string
    charging_port: string
    sim_type: string
    network: string
    rear_camera: string
    front_camera: string
    wifi: string
    gps: string
    bluetooth: string
    jack_phone: string
    other_connections: string
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
    options: ObjectId[]
    image: string
    images: string[]
    infor_detail: string
    description: string
    brand: ObjectId
    guarantee: string
    series: string
    screen_type: string
    resolution: string
    operating_system: string
    memory: string
    chip: string
    battery: string
    battery_technology: string
    charging_port: string
    sim_type: string
    network: string
    rear_camera: string
    front_camera: string
    wifi: string
    gps: string
    bluetooth: string
    jack_phone: string
    other_connections: string
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
        this.options = phone.options
        this.image = phone.image
        this.images = phone.images
        this.infor_detail = phone.infor_detail
        this.description = phone.description
        this.brand = phone.brand
        this.guarantee = phone.guarantee || '12 tháng'
        this.series = phone.series
        this.screen_type = phone.screen_type
        this.resolution = phone.resolution
        this.operating_system = phone.operating_system
        this.memory = phone.memory
        this.chip = phone.chip
        this.battery = phone.battery
        this.battery_technology = phone.battery_technology
        this.charging_port = phone.charging_port
        this.sim_type = phone.sim_type
        this.network = phone.network
        this.rear_camera = phone.rear_camera
        this.front_camera = phone.front_camera
        this.wifi = phone.wifi
        this.gps = phone.gps
        this.bluetooth = phone.bluetooth
        this.jack_phone = phone.jack_phone
        this.other_connections = phone.other_connections
        this.size = phone.size
        this.weight = phone.weight
        this.created_at = phone.created_at || date
        this.updated_at = phone.updated_at || date
    }
}
