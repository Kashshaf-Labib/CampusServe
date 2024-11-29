import { Schema, model, Document } from "mongoose";

interface IOrder extends Document {
  student: { type: Schema.Types.ObjectId; ref: "User" };
  foodItems: { foodItem: Schema.Types.ObjectId; quantity: number }[]; // References food items with quantities
  token: string; // Token provided for order identification
  totalAmount: number;
  status: "pending" | "completed" | "cancelled"; // Status of the order
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  foodItems: [
    {
      foodItem: {
        type: Schema.Types.ObjectId,
        ref: "FoodItem",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  token: { type: String, required: true, unique: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = model<IOrder>("Order", orderSchema);
export default Order;
