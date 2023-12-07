"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const { MONGODB_HOST, MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb+srv://${MONGODB_HOST}/${MONGODB_DATABASE}`;
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log(`Connecté à MongoDB`))
    .catch((err) => console.log(err));
