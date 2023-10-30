import { ParamsDictionary } from 'express-serve-static-core'

export interface CreateBrandReqBody {
    name: string
}

export interface DeleteBrandReqParams extends ParamsDictionary {
    brand_id: string
}
