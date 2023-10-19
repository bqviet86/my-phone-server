import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { SearchReqQuery } from '~/models/requests/Search.request'
import searchService from '~/services/search.services'

export const searchController = async (req: Request<ParamsDictionary, any, any, SearchReqQuery>, res: Response) => {
    const limit = Number(req.query.limit)
    const page = Number(req.query.page)
    const content = req.query.content

    const result = await searchService.search({ limit, page, content })

    res.json({
        message: 'Tìm kiếm thành công',
        result: {
            phones: result.phones,
            limit,
            page,
            total_pages: Math.ceil(result.total_phones / Number(limit))
        }
    })
}
