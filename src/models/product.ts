import mongoose, { Schema } from "mongoose";

export interface Product {
  _id: mongoose.Types.ObjectId,
  name: string;
  description: string;
  price: number;
}

const productSchema = new Schema<Product>({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
});

export default mongoose.model<Product>("Product", productSchema);
