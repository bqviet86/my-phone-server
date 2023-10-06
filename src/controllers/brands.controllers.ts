import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { BRANDS_MESSAGES } from '~/constants/messages'
import { CreateBrandReqBody } from '~/models/requests/Brand.requests'
import brandService from '~/services/brands.services'

export const createBrandController = async (req: Request<ParamsDictionary, any, CreateBrandReqBody>, res: Response) => {
    const result = await brandService.createBrand(req.body)

    return res.json({
        message: BRANDS_MESSAGES.CREATE_BRAND_SUCCESS,
        result
    })
}
