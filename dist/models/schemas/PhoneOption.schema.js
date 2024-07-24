"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PhoneOption {
    constructor(phoneOption) {
        const date = new Date();
        this._id = phoneOption._id;
        this.color = phoneOption.color;
        this.capacity = phoneOption.capacity;
        this.price = phoneOption.price;
        this.price_before_discount = phoneOption.price_before_discount;
        this.quantity = phoneOption.quantity;
        this.images = phoneOption.images;
        this.created_at = phoneOption.created_at || date;
        this.updated_at = phoneOption.updated_at || date;
    }
}
exports.default = PhoneOption;
