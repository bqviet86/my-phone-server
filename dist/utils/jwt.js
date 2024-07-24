"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const signToken = ({ payload, privateKey, options = { algorithm: 'HS256' } }) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, privateKey, options, function (error, token) {
            if (error) {
                reject(error);
            }
            resolve(token);
        });
    });
};
exports.signToken = signToken;
const verifyToken = ({ token, secretOrPublicKey }) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretOrPublicKey, (error, decoded) => {
            if (error) {
                reject(error);
            }
            resolve(decoded);
        });
    });
};
exports.verifyToken = verifyToken;
