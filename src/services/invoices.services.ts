import { ObjectId } from 'mongodb'

import { INVOICE_MESSAGES } from '~/constants/messages'
import Invoice from '~/models/schemas/Invoice.schema'
import Order from '~/models/schemas/Orders.schema'
import databaseService from './database.services'

class InvoiceService {
    async createInvoice(order_id: string) {
        const result = await databaseService.invoices.insertOne(
            new Invoice({
                order_id: new ObjectId(order_id)
            })
        )
        const invoice = await databaseService.invoices.findOne({
            _id: result.insertedId
        })

        return invoice
    }

    async getInvoice(order_id: string, order: Order) {
        const [invoice] = await databaseService.invoices
            .aggregate<Invoice>([
                {
                    $match: {
                        order_id: new ObjectId(order_id)
                    }
                },
                {
                    $addFields: {
                        order
                    }
                }
            ])
            .toArray()

        return invoice
    }

    async deleteInvoice(order_id: string) {
        await databaseService.invoices.deleteOne({
            order_id: new ObjectId(order_id)
        })

        return { message: INVOICE_MESSAGES.DELETE_INVOICE_SUCCESS }
    }
}

const invoiceService = new InvoiceService()

export default invoiceService
