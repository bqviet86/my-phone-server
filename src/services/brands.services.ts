import { ObjectId } from 'mongodb'

import { BRANDS_MESSAGES } from '~/constants/messages'
import { CreateBrandReqBody } from '~/models/requests/Brand.requests'
import Brand from '~/models/schemas/Brand.schema'
import databaseService from './database.services'

class BrandService {
    async createBrand(payload: CreateBrandReqBody) {
        const result = await databaseService.brands.insertOne(new Brand(payload))
        const brand = await databaseService.brands.findOne({ _id: result.insertedId })

        return brand
    }

    async getAllBrands() {
        const result = await databaseService.brands.find({}).toArray()

        return result
    }

    async deleteBrand(brand_id: string) {
        await databaseService.brands.deleteOne({ _id: new ObjectId(brand_id) })

        return { message: BRANDS_MESSAGES.DELETE_BRAND_SUCCESS }
    }
}

const brandService = new BrandService()

export default brandService
