import mongoose, { Schema } from 'mongoose';

export interface User {
  _id: Schema.Types.ObjectId,
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const userSchema = new Schema<User>({
  firstname: { 
    type: String, 
    required: true 
  },
  lastname: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
});

export default mongoose.model<User>('User', userSchema);