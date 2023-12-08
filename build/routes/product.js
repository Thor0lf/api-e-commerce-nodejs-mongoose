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
const express_1 = require("express");
const product_1 = __importDefault(require("../models/product")); //
const validatorCreateProduct_1 = require("../middlewares/validatorCreateProduct");
const validatorUpdateProduct_1 = require("../middlewares/validatorUpdateProduct");
const authorizeRole_1 = require("../middlewares/authorizeRole");
const product = (0, express_1.Router)();
product.get("/", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find({});
        return res.status(200).json(products);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur lors de la récupération des produits." });
    }
}));
product.get("/:productId", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const product = yield product_1.default.findOne({ _id: productId });
        return res.status(200).json(product);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur lors de la récupération du produit." });
    }
}));
product.post("/create", (0, authorizeRole_1.authorize)(["Gestionnaire", "Administrateur"]), validatorCreateProduct_1.validateCreateProductInput, validatorCreateProduct_1.handleCreateProductValidationErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price } = req.body;
        const existingProduct = yield product_1.default.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: "Le produit existe déjà." });
        }
        const newProduct = new product_1.default({ name, description, price });
        yield newProduct.save();
        return res
            .status(201)
            .json({
            message: `Le produit ${newProduct.name} a été créé avec succès.`,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur lors de la création du produit." });
    }
}));
product.patch("/:productId", (0, authorizeRole_1.authorize)(["Gestionnaire", "Administrateur"]), validatorUpdateProduct_1.validateUpdateProductInput, validatorUpdateProduct_1.handleUpdateProductValidationErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const { name, description, price } = req.body;
        const product = yield product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }
        if (name)
            product.name = name;
        if (description)
            product.description = description;
        if (price)
            product.price = price;
        yield product.save();
        return res
            .status(200)
            .json({ message: `Le produit a été mis à jour avec succès.` });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur lors de la mise à jour deu produit." });
    }
}));
product.delete("/:productId", (0, authorizeRole_1.authorize)(["Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const product = yield product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }
        yield product.deleteOne();
        return res
            .status(200)
            .json({
            message: `Le produit ${product.name} a été supprimé avec succès.`,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur lors de la suppression du produit." });
    }
}));
exports.default = product;
