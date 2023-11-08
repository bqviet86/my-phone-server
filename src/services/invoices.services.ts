import { ObjectId } from 'mongodb'

import databaseService from './database.services'
import Invoice from '~/models/schemas/Invoice.schema'
import Order from '~/models/schemas/Orders.schema'

class InvoiceService {
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
}

const invoiceService = new InvoiceService()

export default invoiceService
