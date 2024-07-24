"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../constants/enums");
class Payment {
    constructor(payment) {
        const date = new Date();
        this._id = payment._id;
        this.order_id = payment.order_id;
        this.payment_method = payment.payment_method;
        this.total_price = payment.total_price;
        this.bank_code = payment.bank_code || '';
        this.card_type = payment.card_type || '';
        this.payment_status = payment.payment_status || enums_1.PaymentStatus.PendingPayment;
        this.created_at = payment.created_at || date;
        this.updated_at = payment.updated_at || date;
    }
}
exports.default = Payment;
