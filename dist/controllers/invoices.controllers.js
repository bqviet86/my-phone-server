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
exports.deleteInvoiceController = exports.getInvoiceController = exports.createInvoiceController = void 0;
const messages_1 = require("../constants/messages");
const invoices_services_1 = __importDefault(require("../services/invoices.services"));
const createInvoiceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id } = req.body;
    const result = yield invoices_services_1.default.createInvoice(order_id);
    return res.json({
        message: messages_1.INVOICE_MESSAGES.CREATE_INVOICE_SUCCESS,
        result
    });
});
exports.createInvoiceController = createInvoiceController;
const getInvoiceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id } = req.params;
    const order = req.order;
    const result = yield invoices_services_1.default.getInvoice(order_id, order);
    return res.json({
        message: messages_1.INVOICE_MESSAGES.GET_INVOICE_SUCCESS,
        result
    });
});
exports.getInvoiceController = getInvoiceController;
const deleteInvoiceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id } = req.params;
    const result = yield invoices_services_1.default.deleteInvoice(order_id);
    return res.json(result);
});
exports.deleteInvoiceController = deleteInvoiceController;
