import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { PHONES_MESSAGES } from '~/constants/messages'
import {
    CreatePhoneOptionReqBody,
    CreatePhoneReqBody,
    DeletePhoneOptionReqParams,
    DeletePhoneReqParams,
    GetPhoneReqParams,
    UpdatePhoneOptionReqBody,
    UpdatePhoneOptionReqParams,
    UpdatePhoneReqBody,
    UpdatePhoneReqParams
} from '~/models/requests/Phone.requests'
import Brand from '~/models/schemas/Brand.schema'
import Phone from '~/models/schemas/Phone.schema'
import PhoneOption from '~/models/schemas/PhoneOption.schema'
import phoneService from '~/services/phones.services'

export const createPhoneOptionController = async (
    req: Request<ParamsDictionary, any, CreatePhoneOptionReqBody>,
    res: Response
) => {
    const result = await phoneService.createPhoneOption(req.body)

    return res.json({
        message: PHONES_MESSAGES.CREATE_PHONE_OPTION_SUCCESSFULLY,
        result
    })
}

export const updatePhoneOptionController = async (
    req: Request<UpdatePhoneOptionReqParams, any, UpdatePhoneOptionReqBody>,
    res: Response
) => {
    const { phone_option_id } = req.params
    const result = await phoneService.updatePhoneOption(phone_option_id, req.body)

    return res.json({
        message: PHONES_MESSAGES.UPDATE_PHONE_OPTION_SUCCESSFULLY,
        result
    })
}

export const deletePhoneOptionController = async (req: Request<DeletePhoneOptionReqParams>, res: Response) => {
    const { phone_option_id } = req.params
    const result = await phoneService.deletePhoneOption(phone_option_id)

    return res.json(result)
}

export const createPhoneController = async (req: Request<ParamsDictionary, any, CreatePhoneReqBody>, res: Response) => {
    const phone_options = req.phone_options as PhoneOption[]
    const brand = req.brand as Brand
    const result = await phoneService.createPhone({ phone_options, brand, payload: req.body })

    return res.json({
        message: PHONES_MESSAGES.CREATE_PHONE_SUCCESSFULLY,
        result
    })
}

export const getPhoneController = (req: Request<GetPhoneReqParams>, res: Response) => {
    const phone = req.phone as Phone

    return res.json({
        message: PHONES_MESSAGES.GET_PHONE_SUCCESSFULLY,
        result: phone
    })
}

export const updatePhoneController = async (
    req: Request<UpdatePhoneReqParams, any, UpdatePhoneReqBody>,
    res: Response
) => {
    const { phone_id } = req.params
    const phone_options = req.phone_options as PhoneOption[]
    const result = await phoneService.updatePhone({ phone_id, phone_options, payload: req.body })

    return res.json({
        message: PHONES_MESSAGES.UPDATE_PHONE_SUCCESSFULLY,
        result
    })
}

export const deletePhoneController = async (req: Request<DeletePhoneReqParams>, res: Response) => {
    const { phone_id } = req.params
    const result = await phoneService.deletePhone(phone_id)

    return res.json(result)
}
