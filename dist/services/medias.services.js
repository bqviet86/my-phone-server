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
const dotenv_1 = require("dotenv");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const dir_1 = require("../constants/dir");
const enums_1 = require("../constants/enums");
const file_1 = require("../utils/file");
(0, dotenv_1.config)();
class MediaService {
    uploadImage({ req, maxFiles, maxFileSize = 10 * 1024 * 1024 // 10mb
     }) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield (0, file_1.handleUploadImage)({ req, maxFiles, maxFileSize });
            const result = [];
            for (const file of files) {
                const newFilename = `${(0, file_1.getNameFromFilename)(file.newFilename)}.jpeg`;
                const newFilepath = path_1.default.resolve(dir_1.UPLOAD_IMAGE_DIR, newFilename);
                yield (0, sharp_1.default)(file.filepath).jpeg({ quality: 100 }).toFile(newFilepath);
                sharp_1.default.cache(false);
                yield promises_1.default.unlink(file.filepath);
                result.push({
                    url: `http://localhost:${process.env.PORT}/static/image/${newFilename}`,
                    type: enums_1.MediaTypes.Image
                });
            }
            return result;
        });
    }
    uploadVideo({ req, maxFiles, maxFileSize = 50 * 1024 * 1024 // 50mb
     }) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield (0, file_1.handleUploadVideo)({ req, maxFiles, maxFileSize });
            const result = files.map((file) => {
                return {
                    url: `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
                    type: enums_1.MediaTypes.Video
                };
            });
            return result;
        });
    }
}
const mediaService = new MediaService();
exports.default = mediaService;
