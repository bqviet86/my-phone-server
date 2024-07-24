"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const static_controllers_1 = require("../controllers/static.controllers");
const staticRouter = (0, express_1.Router)();
staticRouter.get('/image/:name', static_controllers_1.serveImageController);
staticRouter.get('/video/:name', static_controllers_1.serveVideoController);
exports.default = staticRouter;
