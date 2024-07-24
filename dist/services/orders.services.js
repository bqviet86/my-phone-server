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
const dotenv_1 = require("dotenv");
const mongodb_1 = require("mongodb");
const moment_1 = __importDefault(require("moment"));
const qs_1 = __importDefault(require("qs"));
const crypto_1 = __importDefault(require("crypto"));
const enums_1 = require("../constants/enums");
const Orders_schema_1 = __importDefault(require("../models/schemas/Orders.schema"));
const Payments_schema_1 = __importDefault(require("../models/schemas/Payments.schema"));
const database_services_1 = __importDefault(require("./database.services"));
const invoices_services_1 = __importDefault(require("./invoices.services"));
(0, dotenv_1.config)();
class OrderService {
    sortObject(obj) {
        const sorted = {};
        const str = [];
        let key;
        for (key in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }
        return sorted;
    }
    createPaymentUrl({ req, order_id, amount }) {
        const date = new Date();
        const createDate = (0, moment_1.default)(date).format('YYYYMMDDHHmmss');
        const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        let vnpUrl = process.env.VNP_URL;
        const tmnCode = process.env.VNP_TMN_CODE;
        const secretKey = process.env.VNP_HASH_SECRET;
        const returnUrl = process.env.VNP_RETURN_URL;
        const locale = 'vn';
        const currCode = 'VND';
        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: currCode,
            vnp_TxnRef: order_id,
            vnp_OrderInfo: `Thanh toan cho ma GD: ${order_id}`,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };
        vnp_Params = this.sortObject(vnp_Params);
        const signData = qs_1.default.stringify(vnp_Params, { encode: false });
        const hmac = crypto_1.default.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params.vnp_SecureHash = signed;
        vnpUrl += `?${qs_1.default.stringify(vnp_Params, { encode: false })}`;
        return vnpUrl;
    }
    createOrder({ req, user_id, carts, delivery_address, payment_method, payload }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Tạo order và payment
            const cart_ids = carts.map((cart) => new mongodb_1.ObjectId(cart._id));
            const insertOrderResult = yield database_services_1.default.orders.insertOne(new Orders_schema_1.default(Object.assign(Object.assign({}, payload), { user_id: new mongodb_1.ObjectId(user_id), carts: cart_ids, address: delivery_address, order_status: payment_method === enums_1.PaymentMethod.CreditCard
                    ? enums_1.OrderStatus.PendingPayment
                    : enums_1.OrderStatus.PendingConfirmation })));
            yield database_services_1.default.payments.insertOne(new Payments_schema_1.default({
                order_id: new mongodb_1.ObjectId(insertOrderResult.insertedId),
                payment_method,
                total_price: carts.reduce((total, cart) => total + cart.total_price, 0)
            }));
            // Lấy thông tin order vừa tạo kèm payment và câp nhật lại trạng thái của các cart
            const [[order], _] = yield Promise.all([
                database_services_1.default.orders
                    .aggregate([
                    {
                        $match: {
                            _id: new mongodb_1.ObjectId(insertOrderResult.insertedId)
                        }
                    },
                    {
                        $lookup: {
                            from: 'payments',
                            localField: '_id',
                            foreignField: 'order_id',
                            as: 'payment'
                        }
                    },
                    {
                        $unwind: {
                            path: '$payment'
                        }
                    }
                ])
                    .toArray(),
                database_services_1.default.carts.updateMany({
                    _id: {
                        $in: cart_ids
                    }
                }, {
                    $set: {
                        cart_status: enums_1.CartStatus.Ordered
                    },
                    $currentDate: {
                        updated_at: true
                    }
                })
            ]);
            // Tạo url thanh toán
            let payment_url = '';
            if (payment_method === enums_1.PaymentMethod.CreditCard) {
                payment_url = this.createPaymentUrl({
                    req,
                    order_id: (_a = order._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    amount: order.payment.total_price
                });
            }
            return {
                order,
                payment_url
            };
        });
    }
    orderSuccess(vnp_Params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (vnp_Params.vnp_ResponseCode === '00') {
                const order_id = vnp_Params.vnp_TxnRef;
                // Tìm kiếm payment có phương thức thanh toán qua VNPAY và có trạng thái PendingPayment (chưa thanh toán)
                const payment = yield database_services_1.default.payments.findOne({
                    order_id: new mongodb_1.ObjectId(order_id),
                    payment_method: enums_1.PaymentMethod.CreditCard,
                    payment_status: enums_1.PaymentStatus.PendingPayment
                });
                // Tìm kiếm order có trạng thái PendingPayment (chờ thanh toán)
                const order = yield database_services_1.default.orders.findOne({
                    _id: new mongodb_1.ObjectId(order_id),
                    order_status: enums_1.OrderStatus.PendingPayment
                });
                if (payment && order) {
                    // Cập nhật trạng thái thanh toán của payment và order
                    yield Promise.all([
                        database_services_1.default.payments.updateOne({
                            _id: new mongodb_1.ObjectId(payment._id)
                        }, {
                            $set: {
                                bank_code: vnp_Params.vnp_BankCode,
                                card_type: vnp_Params.vnp_CardType,
                                payment_status: enums_1.PaymentStatus.Paid
                            },
                            $currentDate: {
                                updated_at: true
                            }
                        }),
                        database_services_1.default.orders.updateOne({
                            _id: new mongodb_1.ObjectId(order._id)
                        }, {
                            $set: {
                                order_status: enums_1.OrderStatus.PendingConfirmation
                            },
                            $currentDate: {
                                updated_at: true
                            }
                        })
                    ]);
                    return {
                        order_id,
                        success: true
                    };
                }
            }
            return {
                success: false
            };
        });
    }
    getAllOrders({ user_id, role, order_status }) {
        return __awaiter(this, void 0, void 0, function* () {
            const $match = Object.assign(Object.assign({}, (role === enums_1.UserRole.User && {
                user_id: new mongodb_1.ObjectId(user_id)
            })), (order_status && {
                order_status: Number(order_status)
            }));
            const orders = yield database_services_1.default.orders
                .aggregate([
                {
                    $match
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user'
                    }
                },
                {
                    $lookup: {
                        from: 'carts',
                        localField: 'carts',
                        foreignField: '_id',
                        as: 'carts'
                    }
                },
                {
                    $unwind: {
                        path: '$carts'
                    }
                },
                {
                    $lookup: {
                        from: 'phones',
                        localField: 'carts.phone_id',
                        foreignField: '_id',
                        as: 'carts.phone'
                    }
                },
                {
                    $unwind: {
                        path: '$carts.phone'
                    }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'carts.phone.brand',
                        foreignField: '_id',
                        as: 'carts.phone.brand'
                    }
                },
                {
                    $unwind: {
                        path: '$carts.phone.brand'
                    }
                },
                {
                    $lookup: {
                        from: 'phone_options',
                        localField: 'carts.phone_option_id',
                        foreignField: '_id',
                        as: 'carts.phone_option'
                    }
                },
                {
                    $unwind: {
                        path: '$carts.phone_option'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        user: {
                            $first: '$user'
                        },
                        address: {
                            $first: '$address'
                        },
                        carts: {
                            $push: '$carts'
                        },
                        content: {
                            $first: '$content'
                        },
                        order_status: {
                            $first: '$order_status'
                        },
                        created_at: {
                            $first: '$created_at'
                        },
                        updated_at: {
                            $first: '$updated_at'
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'payments',
                        localField: '_id',
                        foreignField: 'order_id',
                        as: 'payment'
                    }
                },
                {
                    $unwind: {
                        path: '$payment'
                    }
                },
                {
                    $project: {
                        user: {
                            password: 0,
                            email_verify_token: 0,
                            forgot_password_token: 0
                        },
                        carts: {
                            user_id: 0,
                            phone_id: 0,
                            phone_option_id: 0,
                            phone: {
                                price: 0,
                                price_before_discount: 0,
                                image: 0,
                                options: 0,
                                description: 0,
                                screen_type: 0,
                                resolution: 0,
                                operating_system: 0,
                                memory: 0,
                                chip: 0,
                                battery: 0,
                                rear_camera: 0,
                                front_camera: 0,
                                wifi: 0,
                                jack_phone: 0,
                                size: 0,
                                weight: 0
                            }
                        }
                    }
                },
                {
                    // Sắp xếp theo ngày tạo giảm dần
                    $sort: {
                        created_at: -1
                    }
                }
            ])
                .toArray();
            return orders;
        });
    }
    updateOrder({ order_id, carts, delivery_address, payment_method, payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            let old_address = undefined;
            if (!delivery_address) {
                const order = yield database_services_1.default.orders.findOne({
                    _id: new mongodb_1.ObjectId(order_id)
                });
                old_address = order === null || order === void 0 ? void 0 : order.address;
            }
            const [order, payment] = yield Promise.all([
                database_services_1.default.orders.findOneAndUpdate({
                    _id: new mongodb_1.ObjectId(order_id)
                }, {
                    $set: Object.assign(Object.assign({}, payload), { carts: payload.carts.map((cart) => new mongodb_1.ObjectId(cart)), address: delivery_address || old_address, order_status: payment_method === enums_1.PaymentMethod.CreditCard
                            ? enums_1.OrderStatus.PendingPayment
                            : enums_1.OrderStatus.PendingConfirmation }),
                    $currentDate: {
                        updated_at: true
                    }
                }, {
                    returnDocument: 'after',
                    includeResultMetadata: false
                }),
                database_services_1.default.payments.findOneAndUpdate({
                    order_id: new mongodb_1.ObjectId(order_id)
                }, {
                    $set: {
                        payment_method,
                        total_price: carts.reduce((total, cart) => total + cart.total_price, 0),
                        payment_status: enums_1.PaymentStatus.PendingPayment
                    },
                    $currentDate: {
                        updated_at: true
                    }
                }, {
                    returnDocument: 'after',
                    includeResultMetadata: false
                })
            ]);
            return {
                order: order,
                payment: payment
            };
        });
    }
    confirmPayment({ req, order_id, carts, delivery_address, payment_method, payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { order, payment } = yield this.updateOrder({
                order_id,
                carts,
                delivery_address,
                payment_method,
                payload
            });
            // Tạo url thanh toán
            let payment_url = '';
            if (payment_method === enums_1.PaymentMethod.CreditCard) {
                payment_url = this.createPaymentUrl({
                    req,
                    order_id: order._id.toString(),
                    amount: payment.total_price
                });
            }
            return {
                order,
                payment_url
            };
        });
    }
    updateOrderStatus({ order_id, order_status }) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield database_services_1.default.orders.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(order_id)
            }, {
                $set: {
                    order_status
                },
                $currentDate: {
                    updated_at: true
                }
            }, {
                returnDocument: 'after',
                includeResultMetadata: false
            });
            if (order_status === enums_1.OrderStatus.Processing) {
                yield invoices_services_1.default.createInvoice(order_id);
            }
            if (order_status === enums_1.OrderStatus.Cancelled) {
                yield invoices_services_1.default.deleteInvoice(order_id);
            }
            return order;
        });
    }
}
const orderService = new OrderService();
exports.default = orderService;
