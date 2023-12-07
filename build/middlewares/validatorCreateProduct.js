"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateProductValidationErrors = exports.validateCreateProductInput = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateProductInput = [
    (0, express_validator_1.body)('name')
        .isLength({ min: 5 })
        .withMessage('Le nom du produit est trop court.'),
    (0, express_validator_1.body)('description')
        .isLength({ min: 20 })
        .withMessage('La description est trop courte.'),
    (0, express_validator_1.body)('price')
        .isNumeric()
        .withMessage('Le prix doit avoir une valeur numérique.'),
];
const handleCreateProductValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(422).json({ errors: errorMessages });
    }
    next();
};
exports.handleCreateProductValidationErrors = handleCreateProductValidationErrors;
