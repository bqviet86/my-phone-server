import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface CreatePhoneOptionReqBody {
    color: string
    capacity: string
    price: number
    price_before_discount: number
    quantity: number
    images: string[]
}

export interface UpdatePhoneOptionReqParams extends ParamsDictionary {
    phone_option_id: string
}

export interface UpdatePhoneOptionReqBody {
    color?: string
    capacity?: string
    price?: number
    price_before_discount?: number
    quantity?: number
    images?: string[]
}

export interface DeletePhoneOptionReqParams extends ParamsDictionary {
    phone_option_id: string
}

export interface CreatePhoneReqBody {
    name: string
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
}

export interface GetPhoneReqParams extends ParamsDictionary {
    phone_id: string
}

export interface GetAllPhonesReqQuery extends Query {
    brand: string
    page: string
    limit: string
}

export interface UpdatePhoneReqParams extends ParamsDictionary {
    phone_id: string
}

export interface UpdatePhoneReqBody {
    name?: string
    image?: string
    options?: string[]
    description?: string
    brand?: string
    screen_type?: string
    resolution?: string
    operating_system?: string
    memory?: string
    chip?: string
    battery?: string
    rear_camera?: string
    front_camera?: string
    wifi?: string
    jack_phone?: string
    size?: string
    weight?: string
}

export interface DeletePhoneReqParams extends ParamsDictionary {
    phone_id: string
}
