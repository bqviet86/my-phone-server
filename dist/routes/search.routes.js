"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controllers_1 = require("../controllers/search.controllers");
const common_middlewares_1 = require("../middlewares/common.middlewares");
const search_middlewares_1 = require("../middlewares/search.middlewares");
const searchRouter = (0, express_1.Router)();
/**
 * Description: Search phones
 * Path: /
 * Method: GET
 * Query: SearchReqQuery
 */
searchRouter.get('/', common_middlewares_1.paginationValidator, search_middlewares_1.searchValidator, search_controllers_1.searchController);
exports.default = searchRouter;
