import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { User } from "../models/user";

export const authorize = (roles: string[] | undefined) => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: User) => {
        if (err || !user || !roles?.includes(user.role)) {
          console.log(roles);

          return res.status(403).json({ message: "Accès non autorisé." });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};
