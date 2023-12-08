import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

export const validateUpdateProductInput: ValidationChain[] = [
  body("name")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Le nom du produit est trop court."),
  body("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("La description est trop courte."),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Le prix doit avoir une valeur numérique."),
  body("role")
    .optional()
    .isIn(["Client", "Gestionnaire", "Administrateur"])
    .withMessage("Le rôle n'est pas correct."),
];

export const handleUpdateProductValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });
  }
  next();
};
