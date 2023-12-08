import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import "dotenv/config";

const auth = express.Router();

auth.post("/login", async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Adresse email ou mot de passe incorrect." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Adresse email ou mot de passe incorrect." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la connexion." });
  }
});

export default auth;
