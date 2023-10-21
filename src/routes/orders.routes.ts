import { NextFunction, Request, Response, Router } from 'express'
// import dateFormat from 'dateformat'
import qs from 'qs'
import crypto from 'crypto'

import { accessTokenValidator } from '~/middlewares/users.middlewares'

const ordersRouter = Router()

/**
 * Description: Create order
 * Path: /:payment_method (/0 => CreditCard, /1 => Cash)
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateOrderReqBody
 */
// ordersRouter.post('/:payment_method', accessTokenValidator, createOrderValidator, createOrderController)

ordersRouter.post('/:payment_method', async (req: Request, res: Response, next: NextFunction) => {
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'

    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const tmnCode = 'O1GZV09X'
    const secretKey = 'FAUQLLYYCKYSDVAIMUHCABTFWSQKHNRL'
    const returnUrl = 'http://localhost:3000/thanks'

    const date = new Date()
    const dateFormat = (await import('dateformat')).default

    const createDate = dateFormat(date, 'yyyymmddHHmmss')
    const orderId = 4211 // dateFormat(date, 'HHmmss')
    const amount = 10000
    const bankCode = ''

    const orderInfo = 'Noi dung thanh toan'
    const orderType = 'billpayment'
    const locale = 'vn'
    const currCode = 'VND'

    const vnp_Params: any = {}

    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = tmnCode
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale
    vnp_Params['vnp_CurrCode'] = currCode
    vnp_Params['vnp_TxnRef'] = orderId
    vnp_Params['vnp_OrderInfo'] = orderInfo
    vnp_Params['vnp_OrderType'] = orderType
    vnp_Params['vnp_Amount'] = amount * 100
    vnp_Params['vnp_ReturnUrl'] = returnUrl
    vnp_Params['vnp_IpAddr'] = ipAddr
    vnp_Params['vnp_CreateDate'] = createDate
    vnp_Params['vnp_BankCode'] = bankCode
    // vnp_Params = sortObject(vnp_Params)

    const signData = qs.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    vnp_Params['vnp_SecureHash'] = signed
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false })

    res.redirect(vnpUrl)
})

export default ordersRouter
