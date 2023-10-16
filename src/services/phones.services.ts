import { ObjectId } from 'mongodb'

import { PHONES_MESSAGES } from '~/constants/messages'
import {
    CreatePhoneOptionReqBody,
    CreatePhoneReqBody,
    UpdatePhoneOptionReqBody,
    UpdatePhoneReqBody
} from '~/models/requests/Phone.requests'
import PhoneOption from '~/models/schemas/PhoneOption.schema'
import Phone from '~/models/schemas/Phone.schema'
import Brand from '~/models/schemas/Brand.schema'
import databaseService from './database.services'

class PhoneService {
    async createPhoneOption(payload: CreatePhoneOptionReqBody) {
        const result = await databaseService.phoneOptions.insertOne(new PhoneOption(payload))
        const phoneOption = await databaseService.phoneOptions.findOne({
            _id: result.insertedId
        })

        return phoneOption
    }

    async updatePhoneOption(phone_option_id: string, payload: UpdatePhoneOptionReqBody) {
        const result = await databaseService.phoneOptions.findOneAndUpdate(
            {
                _id: new ObjectId(phone_option_id)
            },
            {
                $set: payload,
                $currentDate: {
                    updated_at: true
                }
            },
            {
                returnDocument: 'after',
                includeResultMetadata: false
            }
        )

        return result
    }

    async deletePhoneOption(phone_option_id: string) {
        await databaseService.phoneOptions.deleteOne({
            _id: new ObjectId(phone_option_id)
        })

        return { message: PHONES_MESSAGES.DELETE_PHONE_OPTION_SUCCESSFULLY }
    }

    private createPriceAndPriceBeforeDiscount(options: PhoneOption[]) {
        const price: number[] = [options[0].price]
        let price_before_discount: number = options[0].price_before_discount

        if (options.length > 1) {
            price.push(options[0].price)

            for (const option of options) {
                if (option.price < price[0]) {
                    price[0] = option.price
                }

                if (option.price > price[1]) {
                    price[1] = option.price
                }

                if (option.price_before_discount > price_before_discount) {
                    price_before_discount = option.price_before_discount
                }
            }

            if (price[0] === price[1]) {
                price.pop()
            }
        }

        return { price, price_before_discount }
    }

    async createPhone({
        phone_options,
        brand,
        payload
    }: {
        phone_options: PhoneOption[]
        brand: Brand
        payload: CreatePhoneReqBody
    }) {
        // Tạo giá và giá gốc
        const { price, price_before_discount } = this.createPriceAndPriceBeforeDiscount(phone_options)

        // Tạo phone
        const result = await databaseService.phones.insertOne(
            new Phone({
                ...payload,
                price,
                price_before_discount
            })
        )

        // Lấy phone vừa tạo, lookup brand và add options
        const [phone] = await databaseService.phones
            .aggregate<Phone>([
                {
                    $match: {
                        _id: result.insertedId
                    }
                },
                {
                    $addFields: {
                        brand,
                        options: phone_options
                    }
                }
            ])
            .toArray()

        return phone
    }

    async getAllPhones({ page, limit, brands }: { page: number; limit: number; brands: Brand[] }) {
        const $match = {
            ...(brands.length > 0 && {
                brand: {
                    $in: brands.map((brand) => brand._id as ObjectId)
                }
            })
        }
        const phones = await databaseService.phones
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
            .toArray()
        const total_phones = await databaseService.phones.countDocuments($match)

        return {
            phones,
            total_phones
        }
    }

    async updatePhone({
        phone_id,
        root_phone_option_ids, // Dữ liệu gốc options của phone
        root_phone_brand_id, // Dữ liệu gốc brand của phone
        phone_options, // Dữ liệu mới options của phone
        brand, // Dữ liệu mới brand của phone
        payload
    }: {
        phone_id: string
        root_phone_option_ids: ObjectId[]
        root_phone_brand_id: ObjectId
        phone_options?: PhoneOption[]
        brand?: Brand
        payload: UpdatePhoneReqBody
    }) {
        const setObject = {
            // Nếu có truyền lên options thì cập nhật lại options, giá và giá gốc
            ...(phone_options && {
                options: (payload.options as string[]).map((option) => new ObjectId(option)),
                ...this.createPriceAndPriceBeforeDiscount(phone_options)
            }),

            // Nếu có truyền lên brand thì cập nhật lại brand
            ...(brand && {
                brand: new ObjectId(payload.brand)
            })
        }

        // Update phone
        const result = await databaseService.phones.findOneAndUpdate(
            {
                _id: new ObjectId(phone_id)
            },
            {
                $set: {
                    ...payload,
                    options: root_phone_option_ids,
                    brand: root_phone_brand_id,
                    ...setObject
                },
                $currentDate: {
                    updated_at: true
                }
            },
            {
                returnDocument: 'after',
                includeResultMetadata: false
            }
        )

        return result
    }

    async deletePhone(phone_id: string) {
        await databaseService.phones.deleteOne({
            _id: new ObjectId(phone_id)
        })

        return { message: PHONES_MESSAGES.DELETE_PHONE_SUCCESSFULLY }
    }
}

const phoneService = new PhoneService()

export default phoneService
