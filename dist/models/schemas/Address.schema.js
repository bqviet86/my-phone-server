"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Address {
    constructor(address) {
        const date = new Date();
        this._id = address._id;
        this.user_id = address.user_id;
        this.name = address.name;
        this.phone_number = address.phone_number;
        this.email = address.email;
        // this.province = address.province
        // this.district = address.district
        // this.ward = address.ward
        this.specific_address = address.specific_address;
        this.default = address.default || false;
        this.created_at = address.created_at || date;
        this.updated_at = address.updated_at || date;
    }
}
exports.default = Address;
