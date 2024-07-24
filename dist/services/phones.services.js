"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const messages_1 = require("../constants/messages");
const PhoneOption_schema_1 = __importDefault(require("../models/schemas/PhoneOption.schema"));
const Phone_schema_1 = __importDefault(require("../models/schemas/Phone.schema"));
const database_services_1 = __importDefault(require("./database.services"));
class PhoneService {
    createPhoneOption(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_services_1.default.phoneOptions.insertOne(new PhoneOption_schema_1.default(payload));
            const phoneOption = yield database_services_1.default.phoneOptions.findOne({
                _id: result.insertedId
            });
            return phoneOption;
        });
    }
    updatePhoneOption(phone_option_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_services_1.default.phoneOptions.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(phone_option_id)
            }, {
                $set: payload,
                $currentDate: {
                    updated_at: true
                }
            }, {
                returnDocument: 'after',
                includeResultMetadata: false
            });
            return result;
        });
    }
    deletePhoneOption(phone_option_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_services_1.default.phoneOptions.deleteOne({
                _id: new mongodb_1.ObjectId(phone_option_id)
            });
            return { message: messages_1.PHONES_MESSAGES.DELETE_PHONE_OPTION_SUCCESSFULLY };
        });
    }
    createPriceAndPriceBeforeDiscount(options) {
        const price = [options[0].price];
        let price_before_discount = options[0].price_before_discount;
        if (options.length > 1) {
            price.push(options[0].price);
            for (const option of options) {
                if (option.price < price[0]) {
                    price[0] = option.price;
                }
                if (option.price > price[1]) {
                    price[1] = option.price;
                }
                if (option.price_before_discount > price_before_discount) {
                    price_before_discount = option.price_before_discount;
                }
            }
            if (price[0] === price[1]) {
                price.pop();
            }
        }
        return { price, price_before_discount };
    }
    createPhone({ phone_options, brand, payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Tạo giá và giá gốc
            const { price, price_before_discount } = this.createPriceAndPriceBeforeDiscount(phone_options);
            // Tạo phone
            const result = yield database_services_1.default.phones.insertOne(new Phone_schema_1.default(Object.assign(Object.assign({}, payload), { price,
                price_before_discount })));
            // Lấy phone vừa tạo, lookup brand và add options
            const [phone] = yield database_services_1.default.phones
                .aggregate([
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
                .toArray();
            return phone;
        });
    }
    getAllPhones({ page, limit, brands }) {
        return __awaiter(this, void 0, void 0, function* () {
            const $match = Object.assign({}, (brands.length > 0 && {
                brand: {
                    $in: brands.map((brand) => brand._id)
                }
            }));
            const [phones, total_phones] = yield Promise.all([
                database_services_1.default.phones
                    .aggregate([
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
                        $sort: {
                            created_at: -1
                        }
                    },
                    {
                        $skip: (page - 1) * limit
                    },
                    {
                        $limit: limit
                    }
                ])
                    .toArray(),
                database_services_1.default.phones.countDocuments($match)
            ]);
            return {
                phones,
                total_phones
            };
        });
    }
    updatePhone({ phone_id, root_phone_option_ids, // Dữ liệu gốc options của phone
    root_phone_brand_id, // Dữ liệu gốc brand của phone
    phone_options, // Dữ liệu mới options của phone
    brand, // Dữ liệu mới brand của phone
    payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const setObject = Object.assign(Object.assign({}, (phone_options && Object.assign({ options: payload.options.map((option) => new mongodb_1.ObjectId(option)) }, this.createPriceAndPriceBeforeDiscount(phone_options)))), (brand && {
                brand: new mongodb_1.ObjectId(payload.brand)
            }));
            // Update phone
            const result = yield database_services_1.default.phones.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(phone_id)
            }, {
                $set: Object.assign(Object.assign(Object.assign({}, payload), { options: root_phone_option_ids, brand: root_phone_brand_id }), setObject),
                $currentDate: {
                    updated_at: true
                }
            }, {
                returnDocument: 'after',
                includeResultMetadata: false
            });
            return result;
        });
    }
    deletePhone(phone_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_services_1.default.phones.deleteOne({
                _id: new mongodb_1.ObjectId(phone_id)
            });
            return { message: messages_1.PHONES_MESSAGES.DELETE_PHONE_SUCCESSFULLY };
        });
    }
}
const phoneService = new PhoneService();
exports.default = phoneService;
