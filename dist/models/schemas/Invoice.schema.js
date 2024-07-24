"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Invoice {
    constructor(invoice) {
        const date = new Date();
        this._id = invoice._id;
        this.order_id = invoice.order_id;
        this.created_at = invoice.created_at || date;
        this.updated_at = invoice.updated_at || date;
    }
}
exports.default = Invoice;
