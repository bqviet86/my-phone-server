import { CreateBrandReqBody } from '~/models/requests/Brand.requests'
import Brand from '~/models/schemas/Brand.schema'
import databaseService from './database.services'

class BrandService {
    async createBrand(payload: CreateBrandReqBody) {
        const result = await databaseService.brands.insertOne(new Brand(payload))
        const brand = await databaseService.brands.findOne({ _id: result.insertedId })

        return brand
    }
}

const brandService = new BrandService()

export default brandService
