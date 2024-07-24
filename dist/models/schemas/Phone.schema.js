"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Phone {
    constructor(phone) {
        const date = new Date();
        this._id = phone._id;
        this.name = phone.name;
        this.price = phone.price;
        this.price_before_discount = phone.price_before_discount;
        this.image = phone.image;
        this.options = phone.options.map((option) => new mongodb_1.ObjectId(option));
        this.description = phone.description;
        this.brand = new mongodb_1.ObjectId(phone.brand);
        this.screen_type = phone.screen_type;
        this.resolution = phone.resolution;
        this.operating_system = phone.operating_system;
        this.memory = phone.memory;
        this.chip = phone.chip;
        this.battery = phone.battery;
        this.rear_camera = phone.rear_camera;
        this.front_camera = phone.front_camera;
        this.wifi = phone.wifi;
        this.jack_phone = phone.jack_phone;
        this.size = phone.size;
        this.weight = phone.weight;
        this.created_at = phone.created_at || date;
        this.updated_at = phone.updated_at || date;
    }
}
exports.default = Phone;
