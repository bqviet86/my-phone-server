"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Brand {
    constructor(brand) {
        const date = new Date();
        this._id = brand._id;
        this.name = brand.name;
        this.created_at = brand.created_at || date;
        this.updated_at = brand.updated_at || date;
    }
}
exports.default = Brand;
