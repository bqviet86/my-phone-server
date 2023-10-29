import { Request } from 'express'
import { Query } from 'express-serve-static-core'
import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import moment from 'moment'
import qs from 'qs'
import crypto from 'crypto'

import { CartStatus, OrderStatus, PaymentMethod, PaymentStatus } from '~/constants/enums'
import { CreateOrderReqBody } from '~/models/requests/Order.request'
import Cart from '~/models/schemas/Cart.schema'
import Order from '~/models/schemas/Orders.schema'
import Payment from '~/models/schemas/Payments.schema'
import databaseService from './database.services'

config()

class OrderService {
    private sortObject(obj: { [key: string]: any }) {
        const sorted: { [key: string]: string } = {}
        const str: string[] = []
        let key

        for (key in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(key as string)) {
                str.push(encodeURIComponent(key))
            }
        }

        str.sort()

        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
        }

        return sorted
    }

    private createPaymentUrl({ req, order_id, amount }: { req: Request; order_id: string; amount: number }) {
        const date = new Date()
        const createDate = moment(date).format('YYYYMMDDHHmmss')

        const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        let vnpUrl = process.env.VNP_URL as string
        const tmnCode = process.env.VNP_TMN_CODE as string
        const secretKey = process.env.VNP_HASH_SECRET as string
        const returnUrl = process.env.VNP_RETURN_URL as string

        const locale = 'vn'
        const currCode = 'VND'

        let vnp_Params: any = {
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
        }

        vnp_Params = this.sortObject(vnp_Params)

        const signData = qs.stringify(vnp_Params, { encode: false })
        const hmac = crypto.createHmac('sha512', secretKey)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

        vnp_Params.vnp_SecureHash = signed
        vnpUrl += `?${qs.stringify(vnp_Params, { encode: false })}`

        return vnpUrl
    }

    async createOrder({
        req,
        user_id,
        carts,
        payment_method,
        payload
    }: {
        req: Request
        user_id: string
        carts: Cart[]
        payment_method: number
        payload: CreateOrderReqBody
    }) {
        // Tạo order và payment
        const cart_ids = carts.map((cart) => new ObjectId(cart._id))
        const insertOrderResult = await databaseService.orders.insertOne(
            new Order({
                ...payload,
                user_id: new ObjectId(user_id),
                carts: cart_ids,
                address: new ObjectId(payload.address),
                status:
                    payment_method === PaymentMethod.CreditCard
                        ? OrderStatus.PendingPayment
                        : OrderStatus.PendingConfirmation
            })
        )

        await databaseService.payments.insertOne(
            new Payment({
                order_id: new ObjectId(insertOrderResult.insertedId),
                payment_method,
                total_price: carts.reduce((total, cart) => total + cart.total_price, 0)
            })
        )

        // Lấy thông tin order vừa tạo kèm payment và câp nhật lại trạng thái của các cart
        const [[order], _] = await Promise.all([
            databaseService.orders
                .aggregate<Order>([
                    {
                        $match: {
                            _id: new ObjectId(insertOrderResult.insertedId)
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
            databaseService.carts.updateMany(
                {
                    _id: {
                        $in: cart_ids
                    }
                },
                {
                    $set: {
                        cart_status: CartStatus.Ordered
                    },
                    $currentDate: {
                        updated_at: true
                    }
                }
            )
        ])

        // Tạo url thanh toán
        let payment_url = ''

        if (payment_method === PaymentMethod.CreditCard) {
            payment_url = this.createPaymentUrl({
                req,
                order_id: order._id?.toString() as string,
                amount: (order as any).payment.total_price as number
            })
        }

        return {
            order,
            payment_url
        }
    }

    async orderSuccess(vnp_Params: Query) {
        if ((vnp_Params.vnp_ResponseCode as string) === '00') {
            const order_id = vnp_Params.vnp_TxnRef as string

            // Tìm kiếm payment có phương thức thanh toán qua VNPAY và có trạng thái PendingPayment (chưa thanh toán)
            const payment = await databaseService.payments.findOne({
                order_id: new ObjectId(order_id),
                payment_method: PaymentMethod.CreditCard,
                payment_status: PaymentStatus.PendingPayment
            })

            // Tìm kiếm order có trạng thái PendingPayment (chờ thanh toán)
            const order = await databaseService.orders.findOne({
                _id: new ObjectId(order_id),
                status: OrderStatus.PendingPayment
            })

            if (payment && order) {
                // Cập nhật trạng thái thanh toán của payment và order
                await Promise.all([
                    databaseService.payments.updateOne(
                        {
                            _id: new ObjectId(payment._id)
                        },
                        {
                            $set: {
                                bank_code: vnp_Params.vnp_BankCode as string,
                                card_type: vnp_Params.vnp_CardType as string,
                                payment_status: PaymentStatus.Paid
                            },
                            $currentDate: {
                                updated_at: true
                            }
                        }
                    ),
                    databaseService.orders.updateOne(
                        {
                            _id: new ObjectId(order._id)
                        },
                        {
                            $set: {
                                status: OrderStatus.PendingConfirmation
                            },
                            $currentDate: {
                                updated_at: true
                            }
                        }
                    )
                ])

                return {
                    order_id,
                    success: true
                }
            }
        }

        return {
            success: false
        }
    }
}

const orderService = new OrderService()

export default orderService
