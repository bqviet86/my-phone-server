import { Router } from 'express'

import { searchController } from '~/controllers/search.controllers'
import { paginationValidator } from '~/middlewares/common.middlewares'
import { searchValidator } from '~/middlewares/search.middlewares'

const searchRouter = Router()

/**
 * Description: Search phones
 * Path: /
 * Method: GET
 * Query: SearchReqQuery
 */
searchRouter.get('/', paginationValidator, searchValidator, searchController)

export default searchRouter
