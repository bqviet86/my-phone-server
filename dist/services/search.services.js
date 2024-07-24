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
const database_services_1 = __importDefault(require("./database.services"));
class SearchService {
    search({ limit, page, content }) {
        return __awaiter(this, void 0, void 0, function* () {
            const $match = {
                $text: {
                    $search: content
                }
            };
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
}
const searchService = new SearchService();
exports.default = searchService;
