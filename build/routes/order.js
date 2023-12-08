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
const order_1 = __importDefault(require("../models/order"));
const product_1 = __importDefault(require("../models/product"));
const mongoose_1 = __importDefault(require("mongoose"));
const authorizeRole_1 = require("../middlewares/authorizeRole");
const order = (0, express_1.Router)();
order.get("/", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find({});
        if (orders.length === 0) {
            return res.status(200).json({ message: "Le panier est vide." });
        }
        return res.status(200).json(orders);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur lors de la récupération des paniers." });
    }
}));
order.get("/:orderId", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    try {
        const order = yield order_1.default.findOne({ _id: orderId });
        if (order === null) {
            return res.status(200).json({ message: "Le panier est vide." });
        }
        return res.status(200).json(order);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur lors de la récupération du produit." });
    }
}));
order.post("/", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const existingOrder = yield order_1.default.findOne({ user: userId });
        if (existingOrder) {
            return updateOrder(req, res);
        }
        else {
            return createOrder(req, res);
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({
            message: "Erreur lors de la création ou de la modification du panier.",
        });
    }
}));
function createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const { productId } = req.body;
            const newOrder = new order_1.default({
                user: userId,
            });
            newOrder.products.push(productId);
            yield newOrder.save();
            const product = yield product_1.default.findById(productId);
            return res
                .status(201)
                .json({
                message: `Le produit ${product === null || product === void 0 ? void 0 : product.name} a été ajouté à votre panier.`,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "Erreur lors de la création du panier." });
        }
    });
}
function updateOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return order.patch("/:orderId/add-product", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { orderId } = req.params;
                    const { productId } = req.body;
                    const existingOrder = yield order_1.default.findById(orderId);
                    if (!existingOrder) {
                        return res.status(404).json({ message: "Panier non trouvé." });
                    }
                    existingOrder.products.push(...productId);
                    yield existingOrder.save();
                    const product = yield product_1.default.findById(productId);
                    return res
                        .status(200)
                        .json({
                        message: `Le produit ${product === null || product === void 0 ? void 0 : product.name} a été ajouté au panier.`,
                    });
                }
                catch (error) {
                    return res
                        .status(500)
                        .json({ message: "Erreur lors de l'ajout de produit au panier." });
                }
            }));
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "Erreur lors de la modification du panier." });
        }
    });
}
order.patch("/:orderId/add-product", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { productId } = req.body;
        const existingOrder = yield order_1.default.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: "Panier non trouvé." });
        }
        const validProductId = new mongoose_1.default.Types.ObjectId(productId);
        const productExists = yield product_1.default.exists({ _id: validProductId });
        if (!productExists) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }
        existingOrder.products.push(validProductId);
        yield existingOrder.save();
        const product = yield product_1.default.findById(validProductId);
        return res.status(200).json({
            message: `Le produit ${product === null || product === void 0 ? void 0 : product.name} a été ajouté au panier.`,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Erreur lors de l'ajout de produit au panier." });
    }
}));
order.patch("/:orderId/remove-product", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { productId } = req.body;
        const existingOrder = yield order_1.default.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: "Panier non trouvé." });
        }
        const product = yield product_1.default.findById(productId);
        const indexToRemove = existingOrder.products.findIndex((product) => product.toString() === productId);
        if (indexToRemove === -1) {
            return res
                .status(404)
                .json({ message: "Produit non trouvé dans le panier." });
        }
        existingOrder.products.splice(indexToRemove, 1);
        yield existingOrder.save();
        return res
            .status(200)
            .json({
            message: `Le produit ${product === null || product === void 0 ? void 0 : product.name} a été enlevé du panier.`,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur lors du retrait du produit du panier." });
    }
}));
order.patch("/:orderId/remove-products-with-same-id", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { productId } = req.body;
        const existingOrder = yield order_1.default.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: "Panier non trouvé." });
        }
        const product = yield product_1.default.findById(productId);
        existingOrder.products = existingOrder.products.filter((product) => product.toString() !== productId);
        yield existingOrder.save();
        return res
            .status(200)
            .json({
            message: `Tous les ${product === null || product === void 0 ? void 0 : product.name} ont été enlevés du panier.`,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({
            message: "Erreur lors de la suppression des produits du panier.",
        });
    }
}));
order.delete("/:orderId", (0, authorizeRole_1.authorize)(["Client", "Gestionnaire", "Administrateur"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const existingOrder = yield order_1.default.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: "Panier non trouvé." });
        }
        yield existingOrder.deleteOne();
        return res.status(200).json({ message: "Le panier a été vidé." });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Erreur lors de la suppression du panier." });
    }
}));
exports.default = order;
