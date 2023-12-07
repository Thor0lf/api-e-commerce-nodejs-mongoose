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
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../models/user")); // 
const validatorRegiserUser_1 = require("../middlewares/validatorRegiserUser");
const validatorUpdateUser_1 = require("../middlewares/validatorUpdateUser");
const user = (0, express_1.Router)();
user.get('/', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({}, '-password');
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
}));
user.get('/:userId', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const user = yield user_1.default.findOne({ _id: userId }, '-password');
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.' });
    }
}));
user.post('/register', validatorRegiserUser_1.validateRegisterInput, validatorRegiserUser_1.handleValidationErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lastname, firstname, email, password } = req.body;
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà.' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_1.default({ lastname, firstname, email, password: hashedPassword });
        yield newUser.save();
        return res.status(201).json({ message: `L'utilisateur ${newUser.firstname} ${newUser.lastname} a été créé avec succès.` });
    }
    catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
    }
}));
user.patch('/:userId', passport_1.default.authenticate('jwt', { session: false }), validatorUpdateUser_1.validateUpdateUserInput, validatorUpdateUser_1.handleUpdateUserValidationErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { lastname, firstname, email, password, role } = req.body;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        if (lastname)
            user.lastname = lastname;
        if (firstname)
            user.firstname = firstname;
        if (email)
            user.email = email;
        if (password) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            user.password = hashedPassword;
        }
        yield user.save();
        return res.status(200).json({ message: `L'utilisateur ${user.firstname} ${user.lastname} a été mis à jour avec succès.` });
    }
    catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.' });
    }
}));
user.delete('/:userId', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        yield user.deleteOne();
        return res.status(200).json({ message: `L'utilisateur ${user.firstname} ${user.lastname} a été supprimé avec succès.` });
    }
    catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.' });
    }
}));
exports.default = user;
