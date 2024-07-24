"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Order {
    constructor(order) {
        const date = new Date();
        this._id = order._id;
        this.user_id = order.user_id;
        this.carts = order.carts;
        this.address = order.address;
        this.content = order.content;
        this.order_status = order.order_status;
        this.created_at = order.created_at || date;
        this.updated_at = order.updated_at || date;
    }
}
exports.default = Order;
