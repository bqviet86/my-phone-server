"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveVideoController = exports.serveImageController = void 0;
const path_1 = __importDefault(require("path"));
const dir_1 = require("../constants/dir");
const messages_1 = require("../constants/messages");
const serveImageController = (req, res) => {
    const { name } = req.params;
    return res.sendFile(path_1.default.resolve(dir_1.UPLOAD_IMAGE_DIR, name), (err) => {
        if (err) {
            return res.status(err.status).send({
                message: messages_1.MEDIAS_MESSAGES.IMAGE_NOT_FOUND
            });
        }
    });
};
exports.serveImageController = serveImageController;
const serveVideoController = (req, res) => {
    const { name } = req.params;
    return res.sendFile(path_1.default.resolve(dir_1.UPLOAD_VIDEO_DIR, name), (err) => {
        if (err) {
            return res.status(err.status).send({
                message: messages_1.MEDIAS_MESSAGES.VIDEO_NOT_FOUND
            });
        }
    });
};
exports.serveVideoController = serveVideoController;
