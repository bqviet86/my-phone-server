import { MediaTypes } from '~/constants/enums'

export interface Media {
    url: string
    type: MediaTypes
}

export interface CreditCardInfo {
    cardNumber: string // số thẻ
    cardOwner: string // tên chủ thẻ
    expiredDate: string // ngày hết hạn
}
