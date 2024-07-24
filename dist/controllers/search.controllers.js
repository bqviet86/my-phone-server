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
exports.searchController = void 0;
const search_services_1 = __importDefault(require("../services/search.services"));
const searchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const content = req.query.content;
    const result = yield search_services_1.default.search({ limit, page, content });
    res.json({
        message: 'Tìm kiếm thành công',
        result: {
            phones: result.phones,
            limit,
            page,
            total_pages: Math.ceil(result.total_phones / Number(limit))
        }
    });
});
exports.searchController = searchController;
