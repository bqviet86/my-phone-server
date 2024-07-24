"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoController = exports.uploadImageController = void 0;
const messages_1 = require("../constants/messages");
const medias_services_1 = __importDefault(require("../services/medias.services"));
const uploadImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield medias_services_1.default.uploadImage({ req, maxFiles: 10 });
    return res.json({
        message: messages_1.MEDIAS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
        result: data
    });
});
exports.uploadImageController = uploadImageController;
const uploadVideoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield medias_services_1.default.uploadVideo({ req, maxFiles: 2 });
    return res.json({
        message: messages_1.MEDIAS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
        result: data
    });
});
exports.uploadVideoController = uploadVideoController;
