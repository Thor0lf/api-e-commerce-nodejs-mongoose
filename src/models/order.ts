import mongoose, { Schema } from "mongoose";
import { User } from "./user";
import { Product } from "./product";

interface Order {
  _id: mongoose.Schema.Types.ObjectId;
  user: User["_id"];
  products: Array<Product["_id"]>;
}

const orderSchema: Schema = new Schema<Order>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  ],
});

export default mongoose.model<Order>("Order", orderSchema);
