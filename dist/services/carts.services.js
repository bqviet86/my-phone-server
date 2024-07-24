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
const enums_1 = require("../constants/enums");
const messages_1 = require("../constants/messages");
const Cart_schema_1 = __importDefault(require("../models/schemas/Cart.schema"));
const database_services_1 = __importDefault(require("./database.services"));
class CartService {
    createCart({ user_id, phone_option, payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Kiểm tra xem sản phẩm có option này với trạng thái là Pending có tồn tại trong giỏ hàng không
            const isExist = yield database_services_1.default.carts.findOne({
                user_id: new mongodb_1.ObjectId(user_id),
                phone_id: new mongodb_1.ObjectId(payload.phone_id),
                phone_option_id: new mongodb_1.ObjectId(payload.phone_option_id),
                cart_status: enums_1.CartStatus.Pending
            });
            if (isExist) {
                // Cập nhật lại số lượng và tổng tiền
                const cart = yield database_services_1.default.carts.findOneAndUpdate({
                    _id: isExist._id
                }, {
                    $set: {
                        quantity: isExist.quantity + payload.quantity,
                        total_price: phone_option.price * (isExist.quantity + payload.quantity)
                    },
                    $currentDate: {
                        updated_at: true
                    }
                }, {
                    returnDocument: 'after',
                    includeResultMetadata: false
                });
                return cart;
            }
            else {
                // Thêm mới vào giỏ hàng
                const result = yield database_services_1.default.carts.insertOne(new Cart_schema_1.default(Object.assign(Object.assign({}, payload), { user_id: new mongodb_1.ObjectId(user_id), phone_id: new mongodb_1.ObjectId(payload.phone_id), phone_option_id: new mongodb_1.ObjectId(payload.phone_option_id), total_price: phone_option.price * payload.quantity })));
                const cart = yield database_services_1.default.carts.findOne({
                    _id: result.insertedId
                });
                return cart;
            }
        });
    }
    updateCart({ user_id, cart_id, phone_option, payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_services_1.default.carts.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(cart_id),
                user_id: new mongodb_1.ObjectId(user_id)
            }, {
                $set: Object.assign(Object.assign({}, payload), { phone_option_id: new mongodb_1.ObjectId(payload.phone_option_id), total_price: phone_option.price * payload.quantity }),
                $currentDate: {
                    updated_at: true
                }
            }, {
                returnDocument: 'after',
                includeResultMetadata: false
            });
            return result;
        });
    }
    deleteCart(user_id, cart_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_services_1.default.carts.deleteOne({
                _id: new mongodb_1.ObjectId(cart_id),
                user_id: new mongodb_1.ObjectId(user_id)
            });
            return { message: messages_1.CARTS_MESSAGES.DELETE_CART_SUCCESSFULLY };
        });
    }
}
const cartService = new CartService();
exports.default = cartService;
