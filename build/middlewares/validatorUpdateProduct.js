"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateProductValidationErrors = exports.validateUpdateProductInput = void 0;
const express_validator_1 = require("express-validator");
exports.validateUpdateProductInput = [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Le nom du produit est trop court.'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ min: 20 })
        .withMessage('La description est trop courte.'),
    (0, express_validator_1.body)('price')
        .optional()
        .isNumeric()
        .withMessage('Le prix doit avoir une valeur numérique.'),
];
const handleUpdateProductValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(422).json({ errors: errorMessages });
    }
    next();
};
exports.handleUpdateProductValidationErrors = handleUpdateProductValidationErrors;
