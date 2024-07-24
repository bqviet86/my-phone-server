"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../constants/enums");
class Cart {
    constructor(cart) {
        const date = new Date();
        this._id = cart._id;
        this.user_id = cart.user_id;
        this.phone_id = cart.phone_id;
        this.phone_option_id = cart.phone_option_id;
        this.quantity = cart.quantity;
        this.total_price = cart.total_price;
        this.cart_status = cart.cart_status || enums_1.CartStatus.Pending;
        this.created_at = cart.created_at || date;
        this.updated_at = cart.updated_at || date;
    }
}
exports.default = Cart;
