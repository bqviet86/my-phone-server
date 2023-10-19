import { Query } from 'express-serve-static-core'

export interface SearchReqQuery extends Query {
    page: string
    limit: string
    content: string
}
