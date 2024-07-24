"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoices_controllers_1 = require("../controllers/invoices.controllers");
const invoices_middlewares_1 = require("../middlewares/invoices.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const invoicesRouter = (0, express_1.Router)();
/**
 * Description: Create invoice
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateInvoiceReqBody
 */
invoicesRouter.post('/', users_middlewares_1.accessTokenValidator, invoices_middlewares_1.createInvoiceValidator, (0, handlers_1.wrapRequestHandler)(invoices_controllers_1.createInvoiceController));
/**
 * Description: Get invoice
 * Path: /:order_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: GetInvoiceReqParams
 */
invoicesRouter.get('/:order_id', users_middlewares_1.accessTokenValidator, invoices_middlewares_1.getInvoiceValidator, (0, handlers_1.wrapRequestHandler)(invoices_controllers_1.getInvoiceController));
/**
 * Description: Delete invoice
 * Path: /:order_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: DeleteInvoiceReqParams
 */
invoicesRouter.delete('/:order_id', users_middlewares_1.accessTokenValidator, invoices_middlewares_1.deleteInvoiceValidator, (0, handlers_1.wrapRequestHandler)(invoices_controllers_1.deleteInvoiceController));
exports.default = invoicesRouter;
