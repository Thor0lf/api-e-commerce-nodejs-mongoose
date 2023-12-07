import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from "helmet";
import passport from 'passport';
import auth from './routes/auth';
import order from './routes/order';
import product from './routes/product';
import user from './routes/user';
import './utils/passport';
import './database/index';
import 'dotenv/config';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(helmet());

 app.use(passport.initialize());

app.use('/auth', auth);
app.use('/order', order);
app.use('/product', product);
app.use('/user', user);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});