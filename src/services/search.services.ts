import Phone from '~/models/schemas/Phone.schema'
import databaseService from './database.services'

class SearchService {
    async search({ limit, page, content }: { limit: number; page: number; content: string }) {
        const $match = {
            $text: {
                $search: content
            }
        }
        const [phones, total_phones] = await Promise.all([
            databaseService.phones
                .aggregate<Phone>([
                    {
                        $match
                    },
                    {
                        $lookup: {
                            from: 'brands',
                            localField: 'brand',
                            foreignField: '_id',
                            as: 'brand'
                        }
                    },
                    {
                        $unwind: '$brand'
                    },
                    {
                        $skip: (page - 1) * limit
                    },
                    {
                        $limit: limit
                    }
                ])
                .toArray(),
            databaseService.phones.countDocuments($match)
        ])

        return {
            phones,
            total_phones
        }
    }
}

const searchService = new SearchService()

export default searchService
