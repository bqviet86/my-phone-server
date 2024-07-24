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
const Invoice_schema_1 = __importDefault(require("../models/schemas/Invoice.schema"));
const database_services_1 = __importDefault(require("./database.services"));
class InvoiceService {
    createInvoice(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_services_1.default.invoices.insertOne(new Invoice_schema_1.default({
                order_id: new mongodb_1.ObjectId(order_id)
            }));
            const invoice = yield database_services_1.default.invoices.findOne({
                _id: result.insertedId
            });
            return invoice;
        });
    }
    getInvoice(order_id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const [invoice] = yield database_services_1.default.invoices
                .aggregate([
                {
                    $match: {
                        order_id: new mongodb_1.ObjectId(order_id)
                    }
                },
                {
                    $addFields: {
                        order
                    }
                }
            ])
                .toArray();
            return invoice;
        });
    }
    deleteInvoice(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_services_1.default.invoices.deleteOne({
                order_id: new mongodb_1.ObjectId(order_id)
            });
            return { message: messages_1.INVOICE_MESSAGES.DELETE_INVOICE_SUCCESS };
        });
    }
}
const invoiceService = new InvoiceService();
exports.default = invoiceService;
