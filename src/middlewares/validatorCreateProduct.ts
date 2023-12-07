import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

export const validateCreateProductInput: ValidationChain[] = [
  body('name')
    .isLength({ min: 5 })
    .withMessage('Le nom du produit est trop court.'),
  body('description')
    .isLength({ min: 20 })
    .withMessage('La description est trop courte.'),
  body('price')
    .isNumeric()
    .withMessage('Le prix doit avoir une valeur numérique.'),
];

export const handleCreateProductValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });
  }
  next();
};