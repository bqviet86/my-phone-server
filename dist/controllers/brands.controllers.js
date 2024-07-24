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
exports.deleteBrandController = exports.getAllBrandController = exports.createBrandController = void 0;
const messages_1 = require("../constants/messages");
const brands_services_1 = __importDefault(require("../services/brands.services"));
const createBrandController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brands_services_1.default.createBrand(req.body);
    return res.json({
        message: messages_1.BRANDS_MESSAGES.CREATE_BRAND_SUCCESS,
        result
    });
});
exports.createBrandController = createBrandController;
const getAllBrandController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brands_services_1.default.getAllBrands();
    return res.json({
        message: messages_1.BRANDS_MESSAGES.GET_ALL_BRAND_SUCCESS,
        result
    });
});
exports.getAllBrandController = getAllBrandController;
const deleteBrandController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brand_id } = req.params;
    const result = yield brands_services_1.default.deleteBrand(brand_id);
    return res.json(result);
});
exports.deleteBrandController = deleteBrandController;
