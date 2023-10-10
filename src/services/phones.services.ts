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

    async createPhone(payload: CreatePhoneReqBody) {
        // Lấy ra các options
        const options = await databaseService.phoneOptions
            .find<PhoneOption>({
                _id: {
                    $in: payload.options.map((option) => new ObjectId(option))
                }
            })
            .toArray()
        const { price, price_before_discount } = this.createPriceAndPriceBeforeDiscount(options)

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
                    $addFields: {
                        options
                    }
                }
            ])
            .toArray()

        return phone
    }

    async getPhone(phone_id: string) {
        const [phone] = await databaseService.phones
            .aggregate<Phone>([
                {
                    $match: {
                        _id: new ObjectId(phone_id)
                    }
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
                    $lookup: {
                        from: 'phone_options',
                        localField: 'options',
                        foreignField: '_id',
                        as: 'options'
                    }
                }
            ])
            .toArray()

        return phone
    }

    async updatePhone(phone_id: string, payload: UpdatePhoneReqBody) {
        const optionIds = (payload.options || []).map((option) => new ObjectId(option))

        // Lấy ra các options
        const options = await databaseService.phoneOptions
            .find<PhoneOption>({
                _id: {
                    $in: optionIds
                }
            })
            .toArray()
        const { price, price_before_discount } = this.createPriceAndPriceBeforeDiscount(options)

        // Update phone
        const result = await databaseService.phones.findOneAndUpdate(
            {
                _id: new ObjectId(phone_id)
            },
            {
                $set: {
                    ...payload,
                    options: optionIds,
                    brand: new ObjectId(payload.brand),
                    price,
                    price_before_discount
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
