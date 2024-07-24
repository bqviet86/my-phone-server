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
exports.deleteCartController = exports.updateCartController = exports.getCartController = exports.addToCartController = void 0;
const messages_1 = require("../constants/messages");
const carts_services_1 = __importDefault(require("../services/carts.services"));
const addToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const phone_option = req.phone_option;
    const result = yield carts_services_1.default.createCart({
        user_id,
        phone_option: phone_option,
        payload: req.body
    });
    return res.json({
        message: messages_1.CARTS_MESSAGES.ADD_TO_CART_SUCCESSFULLY,
        result
    });
});
exports.addToCartController = addToCartController;
const getCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const carts = req.carts;
    return res.json({
        message: messages_1.CARTS_MESSAGES.GET_CART_SUCCESSFULLY,
        result: carts
    });
});
exports.getCartController = getCartController;
const updateCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const { cart_id } = req.params;
    const phone_option = req.phone_option;
    const result = yield carts_services_1.default.updateCart({
        user_id,
        cart_id,
        phone_option: phone_option,
        payload: req.body
    });
    return res.json({
        message: messages_1.CARTS_MESSAGES.UPDATE_CART_SUCCESSFULLY,
        result
    });
});
exports.updateCartController = updateCartController;
const deleteCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.decoded_authorization;
    const { cart_id } = req.params;
    const result = yield carts_services_1.default.deleteCart(user_id, cart_id);
    return res.json(result);
});
exports.deleteCartController = deleteCartController;
