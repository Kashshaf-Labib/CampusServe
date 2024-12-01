import { Schema, model, models } from "mongoose";

export interface IOrder {
  student: Schema.Types.ObjectId; // Reference to User
  foodItems: { foodItem: Schema.Types.ObjectId; quantity: number }[]; // Food items with quantities
  token: string; // Token for order identification
  totalAmount: number;
  status: "pending" | "completed" | "cancelled"; // Order status
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  foodItems: [
    {
      foodItem: { type: Schema.Types.ObjectId, ref: "FoodItem", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  token: { type: String, required: true, unique: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "pending", enum: ["pending", "completed", "cancelled"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = models.Order || model<IOrder>("Order", orderSchema);
export default Order;

