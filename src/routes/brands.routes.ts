import { Router } from 'express'

import { createBrandController, deleteBrandController, getAllBrandController } from '~/controllers/brands.controllers'
import { createBrandValidator, deleteBrandValidator } from '~/middlewares/brands.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const brandsRouter = Router()

/**
 * Description: Create a new brand
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateBrandReqBody
 */
brandsRouter.post(
    '/',
    accessTokenValidator,
    isAdminValidator,
    createBrandValidator,
    wrapRequestHandler(createBrandController)
)

/**
 * Description: Get all brands
 * Path: /
 * Method: GET
 */
brandsRouter.get('/', wrapRequestHandler(getAllBrandController))

/**
 * Description: Delete a brand
 * Path: /:brand_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: { brand_id: string }
 */
brandsRouter.delete(
    '/brand_id',
    accessTokenValidator,
    isAdminValidator,
    deleteBrandValidator,
    wrapRequestHandler(deleteBrandController)
)

export default brandsRouter
