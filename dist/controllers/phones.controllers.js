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
exports.deletePhoneController = exports.updatePhoneController = exports.getAllPhonesController = exports.getPhoneController = exports.createPhoneController = exports.deletePhoneOptionController = exports.updatePhoneOptionController = exports.createPhoneOptionController = void 0;
const messages_1 = require("../constants/messages");
const phones_services_1 = __importDefault(require("../services/phones.services"));
const createPhoneOptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield phones_services_1.default.createPhoneOption(req.body);
    return res.json({
        message: messages_1.PHONES_MESSAGES.CREATE_PHONE_OPTION_SUCCESSFULLY,
        result
    });
});
exports.createPhoneOptionController = createPhoneOptionController;
const updatePhoneOptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_option_id } = req.params;
    const result = yield phones_services_1.default.updatePhoneOption(phone_option_id, req.body);
    return res.json({
        message: messages_1.PHONES_MESSAGES.UPDATE_PHONE_OPTION_SUCCESSFULLY,
        result
    });
});
exports.updatePhoneOptionController = updatePhoneOptionController;
const deletePhoneOptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_option_id } = req.params;
    const result = yield phones_services_1.default.deletePhoneOption(phone_option_id);
    return res.json(result);
});
exports.deletePhoneOptionController = deletePhoneOptionController;
const createPhoneController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const phone_options = req.phone_options;
    const brand = req.brand;
    const result = yield phones_services_1.default.createPhone({ phone_options, brand, payload: req.body });
    return res.json({
        message: messages_1.PHONES_MESSAGES.CREATE_PHONE_SUCCESSFULLY,
        result
    });
});
exports.createPhoneController = createPhoneController;
const getPhoneController = (req, res) => {
    const phone = req.phone;
    return res.json({
        message: messages_1.PHONES_MESSAGES.GET_PHONE_SUCCESSFULLY,
        result: phone
    });
};
exports.getPhoneController = getPhoneController;
const getAllPhonesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const brands = req.brands;
    const result = yield phones_services_1.default.getAllPhones({ page, limit, brands });
    return res.json({
        message: messages_1.PHONES_MESSAGES.GET_ALL_PHONES_SUCCESSFULLY,
        result: {
            phones: result.phones,
            limit,
            page,
            total_pages: Math.ceil(result.total_phones / Number(limit))
        }
    });
});
exports.getAllPhonesController = getAllPhonesController;
const updatePhoneController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_id } = req.params;
    const phone = req.phone;
    const phone_options = req.phone_options;
    const brand = req.brand;
    const root_phone_option_ids = phone.options.map((option) => option._id);
    const root_phone_brand_id = phone.brand._id;
    const result = yield phones_services_1.default.updatePhone({
        phone_id,
        root_phone_option_ids,
        root_phone_brand_id,
        phone_options,
        brand,
        payload: req.body
    });
    return res.json({
        message: messages_1.PHONES_MESSAGES.UPDATE_PHONE_SUCCESSFULLY,
        result
    });
});
exports.updatePhoneController = updatePhoneController;
const deletePhoneController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_id } = req.params;
    const result = yield phones_services_1.default.deletePhone(phone_id);
    return res.json(result);
});
exports.deletePhoneController = deletePhoneController;
