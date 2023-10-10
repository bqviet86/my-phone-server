import { Router } from 'express'

import { createBrandController, getAllBrandController } from '~/controllers/brands.controllers'
import { createBrandValidator } from '~/middlewares/brands.middlewares'
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

export default brandsRouter
