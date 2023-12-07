import mongoose from 'mongoose';
import 'dotenv/config';

const { MONGODB_HOST, MONGODB_DATABASE } = process.env;
const MONGODB_URI: string = `mongodb+srv://${MONGODB_HOST}/${MONGODB_DATABASE}`;

mongoose.connect(MONGODB_URI)
 .then(() => console.log(`Connecté à MongoDB`))
 .catch((err: Error) => console.log(err));