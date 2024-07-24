"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medias_controllers_1 = require("../controllers/medias.controllers");
const users_middlewares_1 = require("../middlewares/users.middlewares");
const handlers_1 = require("../utils/handlers");
const mediasRouter = (0, express_1.Router)();
/**
 * Description: Upload image
 * Path: /upload-image
 * Method: POST
 * Body: { image: max 4 files }
 */
mediasRouter.post('/upload-image', users_middlewares_1.accessTokenValidator, (0, handlers_1.wrapRequestHandler)(medias_controllers_1.uploadImageController));
/**
 * Description: Upload video
 * Path: /upload-video
 * Method: POST
 * Body: { video: only 1 file }
 */
mediasRouter.post('/upload-video', users_middlewares_1.accessTokenValidator, (0, handlers_1.wrapRequestHandler)(medias_controllers_1.uploadVideoController));
exports.default = mediasRouter;
