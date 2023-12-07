import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/user'; // 
import { handleValidationErrors, validateRegisterInput } from '../middlewares/validatorRegiserUser';
import { handleUpdateUserValidationErrors, validateUpdateUserInput } from '../middlewares/validatorUpdateUser';

const user = Router();

user.get('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
  }
});

user.get('/:userId', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ _id: userId }, '-password');
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.' });
  }
});

user.post('/register', validateRegisterInput, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { lastname, firstname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ lastname, firstname, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: `L'utilisateur ${newUser.firstname} ${newUser.lastname} a été créé avec succès.` });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
  }
});

user.patch('/:userId', passport.authenticate('jwt', { session: false }), validateUpdateUserInput, handleUpdateUserValidationErrors, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { lastname, firstname, email, password, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    if (lastname) user.lastname = lastname;
    if (firstname) user.firstname = firstname;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return res.status(200).json({ message: `L'utilisateur ${user.firstname} ${user.lastname} a été mis à jour avec succès.` });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.' });
  }
});

user.delete('/:userId', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    await user.deleteOne();

    return res.status(200).json({ message: `L'utilisateur ${user.firstname} ${user.lastname} a été supprimé avec succès.` });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.' });
  }
});

export default user;