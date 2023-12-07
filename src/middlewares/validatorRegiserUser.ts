import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

export const validateRegisterInput: ValidationChain[] = [
  body('email').isEmail().normalizeEmail(),
  body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage(
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un symbole et faire au moins 8 caractères de long.'
    ),
  body('firstname').isLength({ min: 2 }).withMessage('Le prénom est trop court.'),
  body('lastname').isLength({ min: 2 }).withMessage('Le nom est trop court.'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });  }
  next();
};