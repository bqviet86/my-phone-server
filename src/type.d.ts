import { Request } from 'express'

import { TokenPayload } from './models/requests/User.requests'
import { DeliveryAddress } from './models/Others'
import User from './models/schemas/User.schema'
import PhoneOption from './models/schemas/PhoneOption.schema'
import Brand from './models/schemas/Brand.schema'
import Phone from './models/schemas/Phone.schema'
import Cart from './models/schemas/Cart.schema'
import Order from './models/schemas/Orders.schema'
import Address from './models/schemas/Address.schema'

declare module 'express' {
    interface Request {
        user?: User
        decoded_authorization?: TokenPayload
        decoded_refresh_token?: TokenPayload
        decoded_email_verify_token?: TokenPayload
        decoded_forgot_password_token?: TokenPayload
        phone_option?: PhoneOption
        phone_options?: PhoneOption[]
        brand?: Brand
        brands?: Brand[]
        phone?: Phone
        carts?: Cart[]
        delivery_address?: DeliveryAddress
        address?: Address
        order?: Order
    }
}
