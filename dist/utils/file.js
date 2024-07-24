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
exports.handleUploadVideo = exports.handleUploadImage = exports.getExtensionFromFilename = exports.getNameFromFilename = exports.initFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const formidable_1 = __importDefault(require("formidable"));
const dir_1 = require("../constants/dir");
const messages_1 = require("../constants/messages");
const initFolder = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, {
            recursive: true
        });
    }
};
exports.initFolder = initFolder;
const getNameFromFilename = (filename) => {
    const ext = path_1.default.extname(filename);
    return filename.replace(ext, '');
};
exports.getNameFromFilename = getNameFromFilename;
const getExtensionFromFilename = (filename) => {
    const ext = path_1.default.extname(filename);
    return ext.slice(1);
};
exports.getExtensionFromFilename = getExtensionFromFilename;
const handleUploadImage = ({ req, maxFiles, maxFileSize }) => {
    const form = (0, formidable_1.default)({
        uploadDir: dir_1.UPLOAD_IMAGE_TEMP_DIR,
        keepExtensions: true,
        multiples: true,
        maxFiles,
        maxFileSize,
        maxTotalFileSize: maxFiles * maxFileSize,
        filter: ({ name, originalFilename, mimetype }) => {
            const valid = name === 'image' && Boolean(mimetype === null || mimetype === void 0 ? void 0 : mimetype.includes('image'));
            if (!valid) {
                form.emit('error', new Error(messages_1.MEDIAS_MESSAGES.INVALID_FILE_TYPE));
            }
            return valid;
        }
    });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            if (!files.image) {
                return reject(new Error(messages_1.MEDIAS_MESSAGES.NO_IMAGE_PROVIDED));
            }
            resolve(files.image);
        });
    });
};
exports.handleUploadImage = handleUploadImage;
const handleUploadVideo = ({ req, maxFiles, maxFileSize }) => __awaiter(void 0, void 0, void 0, function* () {
    const form = (0, formidable_1.default)({
        uploadDir: dir_1.UPLOAD_VIDEO_DIR,
        keepExtensions: true,
        maxFiles,
        maxFileSize,
        maxTotalFileSize: maxFiles * maxFileSize,
        filter: ({ name, originalFilename, mimetype }) => {
            const valid = name === 'video' && Boolean((mimetype === null || mimetype === void 0 ? void 0 : mimetype.includes('mp4')) || (mimetype === null || mimetype === void 0 ? void 0 : mimetype.includes('quicktime')));
            if (!valid) {
                form.emit('error', new Error(messages_1.MEDIAS_MESSAGES.INVALID_FILE_TYPE));
            }
            return valid;
        }
    });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            if (!files.video) {
                return reject(new Error(messages_1.MEDIAS_MESSAGES.NO_VIDEO_PROVIDED));
            }
            resolve(files.video);
        });
    });
});
exports.handleUploadVideo = handleUploadVideo;
