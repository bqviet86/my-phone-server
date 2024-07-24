"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brands_controllers_1 = require("../controllers/brands.controllers");
const brands_middlewares_1 = require("../middlewares/brands.middlewares");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const brandsRouter = (0, express_1.Router)();
/**
 * Description: Create a new brand
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateBrandReqBody
 */
brandsRouter.post('/', users_middlewares_1.accessTokenValidator, users_middlewares_1.isAdminValidator, brands_middlewares_1.createBrandValidator, (0, handlers_1.wrapRequestHandler)(brands_controllers_1.createBrandController));
/**
 * Description: Get all brands
 * Path: /
 * Method: GET
 */
brandsRouter.get('/', (0, handlers_1.wrapRequestHandler)(brands_controllers_1.getAllBrandController));
/**
 * Description: Delete a brand
 * Path: /:brand_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Params: { brand_id: string }
 */
brandsRouter.delete('/:brand_id', users_middlewares_1.accessTokenValidator, users_middlewares_1.isAdminValidator, brands_middlewares_1.deleteBrandValidator, (0, handlers_1.wrapRequestHandler)(brands_controllers_1.deleteBrandController));
exports.default = brandsRouter;
