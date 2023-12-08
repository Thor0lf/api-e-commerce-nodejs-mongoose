"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateUserValidationErrors = exports.validateUpdateUserInput = void 0;
const express_validator_1 = require("express-validator");
exports.validateUpdateUserInput = [
    (0, express_validator_1.body)("email").optional().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password")
        .optional()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage("Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un symbole et faire au moins 8 caractères de long."),
    (0, express_validator_1.body)("firstname")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Le prénom est trop court."),
    (0, express_validator_1.body)("lastname")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Le nom est trop court."),
];
const handleUpdateUserValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(422).json({ errors: errorMessages });
    }
    next();
};
exports.handleUpdateUserValidationErrors = handleUpdateUserValidationErrors;
