import { MediaTypes } from '~/constants/enums'

export interface Media {
    url: string
    type: MediaTypes
}

export interface DeliveryAddress {
    name: string
    email: string
    phone_number: string
    specific_address: string
}
