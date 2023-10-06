import { Router } from 'express'

import { createBrandController } from '~/controllers/brands.controllers'
import { createBrandValidator } from '~/middlewares/brands.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { CreateBrandReqBody } from '~/models/requests/Brand.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const brandsRouter = Router()

brandsRouter.post(
    '/',
    accessTokenValidator,
    isAdminValidator,
    createBrandValidator,
    filterMiddleware<CreateBrandReqBody>(['name']),
    wrapRequestHandler(createBrandController)
)

export default brandsRouter
