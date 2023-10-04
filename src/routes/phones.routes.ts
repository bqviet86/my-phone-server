import { Router } from 'express'

import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const phonesRouter = Router()

phonesRouter.post(
    '/',
    accessTokenValidator,
    verifiedUserValidator
    // isAdminValidator,
    // wrapRequestHandler(createPhoneController)
)
