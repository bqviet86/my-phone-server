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
exports.updateOrderStatusController = exports.confirmPaymentController = exports.updateOrderController = exports.getAllOrdersController = exports.getOrderController = exports.orderSuccessController = exports.createOrderController = void 0;
const messages_1 = require("../constants/messages");
const orders_services_1 = __importDefault(require("../services/orders.services"));
const createOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { payment_method } = req.params;
    const { user_id } = req.decoded_authorization;
    const carts = req.carts;
    const delivery_address = req.delivery_address;
    const result = yield orders_services_1.default.createOrder({
        req,
        user_id,
        carts,
        delivery_address,
        payment_method: Number(payment_method),
        payload: req.body
    });
    res.json({
        message: messages_1.ORDERS_MESSAGES.CREATE_ORDER_SUCCESSFULLY,
        result
    });
});
exports.createOrderController = createOrderController;
const orderSuccessController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orders_services_1.default.orderSuccess(req.query);
    return res.json({
        message: result.success ? messages_1.ORDERS_MESSAGES.ORDER_SUCCESS : messages_1.ORDERS_MESSAGES.ORDER_FAIL,
        result
    });
});
exports.orderSuccessController = orderSuccessController;
const getOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.order;
    res.json({
        message: messages_1.ORDERS_MESSAGES.GET_ORDER_SUCCESSFULLY,
        result: order
    });
});
exports.getOrderController = getOrderController;
const getAllOrdersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_status } = req.query;
    const { user_id, role } = req.decoded_authorization;
    const result = yield orders_services_1.default.getAllOrders({ user_id, role, order_status });
    res.json({
        message: messages_1.ORDERS_MESSAGES.GET_ALL_ORDERS_SUCCESSFULLY,
        result
    });
});
exports.getAllOrdersController = getAllOrdersController;
const updateOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id, payment_method } = req.params;
    const carts = req.carts;
    const delivery_address = req.delivery_address;
    const result = yield orders_services_1.default.updateOrder({
        order_id,
        carts,
        delivery_address,
        payment_method: Number(payment_method),
        payload: req.body
    });
    res.json({
        message: messages_1.ORDERS_MESSAGES.UPDATE_ORDER_SUCCESSFULLY,
        result
    });
});
exports.updateOrderController = updateOrderController;
const confirmPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id, payment_method } = req.params;
    const carts = req.carts;
    const delivery_address = req.delivery_address;
    const result = yield orders_services_1.default.confirmPayment({
        req,
        order_id,
        carts,
        delivery_address,
        payment_method: Number(payment_method),
        payload: req.body
    });
    res.json({
        message: messages_1.ORDERS_MESSAGES.CONFIRM_PAYMENT_SUCCESSFULLY,
        result
    });
});
exports.confirmPaymentController = confirmPaymentController;
const updateOrderStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id } = req.params;
    const { order_status } = req.body;
    const result = yield orders_services_1.default.updateOrderStatus({
        order_id,
        order_status: Number(order_status)
    });
    res.json({
        message: messages_1.ORDERS_MESSAGES.UPDATE_ORDER_STATUS_SUCCESSFULLY,
        result
    });
});
exports.updateOrderStatusController = updateOrderStatusController;
