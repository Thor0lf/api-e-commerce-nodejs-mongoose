import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema<User>({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Client", "Gestionnaire", "Administrateur"],
    default: "Client",
  },
});

export default mongoose.model<User>("User", userSchema);
