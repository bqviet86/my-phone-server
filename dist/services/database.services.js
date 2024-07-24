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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const uri = process.env.MONGO_DB_URI;
class DatabaseService {
    constructor() {
        this.client = new mongodb_1.MongoClient(uri);
        this.db = this.client.db(process.env.MONGO_DB_NAME);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.command({ ping: 1 });
                console.log('Pinged your deployment. You successfully connected to MongoDB!');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    indexUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.users.indexExists(['name_text', 'email_1']);
            if (!exists) {
                this.users.createIndex({ name: 'text' }, { default_language: 'none' });
                this.users.createIndex({ email: 1 }, { unique: true });
            }
        });
    }
    indexPhones() {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.phones.indexExists(['name_text']);
            if (!exists) {
                this.phones.createIndex({ name: 'text' }, { default_language: 'none' });
            }
        });
    }
    get users() {
        return this.db.collection(process.env.DB_USERS_COLLECTION);
    }
    get refreshTokens() {
        return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION);
    }
    get addresses() {
        return this.db.collection(process.env.DB_ADDRESSES_COLLECTION);
    }
    get brands() {
        return this.db.collection(process.env.DB_BRANDS_COLLECTION);
    }
    get phoneOptions() {
        return this.db.collection(process.env.DB_PHONE_OPTIONS_COLLECTION);
    }
    get phones() {
        return this.db.collection(process.env.DB_PHONES_COLLECTION);
    }
    get carts() {
        return this.db.collection(process.env.DB_CARTS_COLLECTION);
    }
    get payments() {
        return this.db.collection(process.env.DB_PAYMENTS_COLLECTION);
    }
    get orders() {
        return this.db.collection(process.env.DB_ORDERS_COLLECTION);
    }
    get invoices() {
        return this.db.collection(process.env.DB_INVOICES_COLLECTION);
    }
}
const databaseService = new DatabaseService();
exports.default = databaseService;
