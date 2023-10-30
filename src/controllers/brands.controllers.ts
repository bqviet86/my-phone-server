import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { BRANDS_MESSAGES } from '~/constants/messages'
import { CreateBrandReqBody, DeleteBrandReqParams } from '~/models/requests/Brand.requests'
import brandService from '~/services/brands.services'

export const createBrandController = async (req: Request<ParamsDictionary, any, CreateBrandReqBody>, res: Response) => {
    const result = await brandService.createBrand(req.body)

    return res.json({
        message: BRANDS_MESSAGES.CREATE_BRAND_SUCCESS,
        result
    })
}

export const getAllBrandController = async (req: Request, res: Response) => {
    const result = await brandService.getAllBrands()

    return res.json({
        message: BRANDS_MESSAGES.GET_ALL_BRAND_SUCCESS,
        result
    })
}

export const deleteBrandController = async (req: Request<DeleteBrandReqParams>, res: Response) => {
    const { brand_id } = req.params
    const result = await brandService.deleteBrand(brand_id)

    return res.json(result)
}
