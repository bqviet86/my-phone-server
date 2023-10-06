import { Router } from 'express'
import { createPhoneController } from '~/controllers/phones.controllers'

import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const phonesRouter = Router()

/**
 * Description: Create a new phone
 * Path: /
 * Method: POST
 * Body: CreatePhoneReqBody
 */
phonesRouter.post('/', accessTokenValidator, isAdminValidator, wrapRequestHandler(createPhoneController))
