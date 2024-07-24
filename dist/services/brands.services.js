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
const Brand_schema_1 = __importDefault(require("../models/schemas/Brand.schema"));
const database_services_1 = __importDefault(require("./database.services"));
class BrandService {
    createBrand(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_services_1.default.brands.insertOne(new Brand_schema_1.default(payload));
            const brand = yield database_services_1.default.brands.findOne({ _id: result.insertedId });
            return brand;
        });
    }
    getAllBrands() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_services_1.default.brands.find({}).toArray();
            return result;
        });
    }
    deleteBrand(brand_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_services_1.default.brands.deleteOne({ _id: new mongodb_1.ObjectId(brand_id) });
            return { message: messages_1.BRANDS_MESSAGES.DELETE_BRAND_SUCCESS };
        });
    }
}
const brandService = new BrandService();
exports.default = brandService;
