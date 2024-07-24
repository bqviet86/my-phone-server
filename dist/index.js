"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const dir_1 = require("./constants/dir");
const error_middlewares_1 = require("./middlewares/error.middlewares");
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const medias_routes_1 = __importDefault(require("./routes/medias.routes"));
const brands_routes_1 = __importDefault(require("./routes/brands.routes"));
const phones_routes_1 = __importDefault(require("./routes/phones.routes"));
const carts_routes_1 = __importDefault(require("./routes/carts.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const invoices_routes_1 = __importDefault(require("./routes/invoices.routes"));
const search_routes_1 = __importDefault(require("./routes/search.routes"));
const static_routes_1 = __importDefault(require("./routes/static.routes"));
const database_services_1 = __importDefault(require("./services/database.services"));
const file_1 = require("./utils/file");
(0, dotenv_1.config)();
const port = process.env.PORT || 4000;
const app = (0, express_1.default)();
// Init folders
(0, file_1.initFolder)(dir_1.UPLOAD_IMAGE_TEMP_DIR);
(0, file_1.initFolder)(dir_1.UPLOAD_VIDEO_TEMP_DIR);
// Connect to database and index fields
database_services_1.default.connect().then(() => {
    database_services_1.default.indexUser();
    database_services_1.default.indexPhones();
});
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    // origin: ['http://localhost:3000'],
    credentials: true
}));
// Routes
app.use('/users', users_routes_1.default);
app.use('/medias', medias_routes_1.default);
app.use('/brands', brands_routes_1.default);
app.use('/phones', phones_routes_1.default);
app.use('/carts', carts_routes_1.default);
app.use('/orders', orders_routes_1.default);
app.use('/invoices', invoices_routes_1.default);
app.use('/search', search_routes_1.default);
app.use('/static', static_routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello World');
});
// Error handler
app.use(error_middlewares_1.defaultErrorHandler);
app.listen(port, () => console.log(`Listen on http://localhost:${port}`));
