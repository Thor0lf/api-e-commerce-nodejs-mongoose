"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = __importDefault(require("./routes/auth"));
const order_1 = __importDefault(require("./routes/order"));
const product_1 = __importDefault(require("./routes/product"));
const user_1 = __importDefault(require("./routes/user"));
require("./utils/passport");
require("./database/index");
require("dotenv/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(passport_1.default.initialize());
app.use('/auth', auth_1.default);
app.use('/order', order_1.default);
app.use('/product', product_1.default);
app.use('/user', user_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});